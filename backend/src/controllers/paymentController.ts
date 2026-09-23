import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { stripe, isStripeConfigured } from '../lib/stripe';
import { config } from '../config';
import { OrderStatus, PaymentStatus } from '../types';

export async function createCheckoutSessionHandler(req: Request, res: Response): Promise<void> {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(400).json({ error: 'orderId is required.' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      res.status(400).json({ error: 'This order has already been paid.' });
      return;
    }

    // Check if Stripe is configured
    if (!isStripeConfigured() || !stripe) {
      // Demo / Portfolio simulation mode when Stripe keys haven't been pasted into .env
      const mockCheckoutUrl = `${config.frontendUrl}/order-status/${order.orderNumber}?simulated_payment=success&orderId=${order.id}`;
      
      // Update order with mock session
      await prisma.order.update({
        where: { id: order.id },
        data: {
          stripeSessionId: `mock_cs_${Date.now()}`,
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
        },
      });

      res.json({
        success: true,
        isSimulated: true,
        checkoutUrl: mockCheckoutUrl,
        message: 'Stripe keys not configured. Simulating instant successful payment for portfolio demo.',
      });
      return;
    }

    // Build Stripe Line Items
    const lineItems: any[] = order.items.map((item) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.itemName,
          description: Array.isArray(item.selectedOptions) && (item.selectedOptions as any[]).length > 0
            ? (item.selectedOptions as any[]).map((o) => `${o.groupName}: ${o.optionName}`).join(', ')
            : undefined,
        },
        unit_amount: Math.round(item.unitPrice * 100), // amount in pence
      },
      quantity: item.quantity,
    }));

    // Add delivery fee line item if applicable
    if (order.deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'UK Delivery Fee',
            description: `Delivery to ${order.deliveryPostcode}`,
          },
          unit_amount: Math.round(order.deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: order.customerEmail,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      success_url: `${config.frontendUrl}/order-status/${order.orderNumber}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.frontendUrl}/checkout?orderId=${order.id}&status=cancelled`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id,
      },
    });

    res.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('createCheckoutSessionHandler error:', error);
    res.status(500).json({ error: 'Failed to create payment checkout session.' });
  }
}

export async function stripeWebhookHandler(req: Request, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'];

  if (!stripe || !config.stripe.webhookSecret || !sig) {
    res.status(400).send('Webhook secret or signature missing');
    return;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
  } catch (err: any) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const orderId = session.client_reference_id || session.metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
          stripePaymentIntentId: session.payment_intent as string,
        },
      });
      console.log(`✅ Order ${orderId} marked as PAID via Stripe webhook.`);
    }
  }

  res.json({ received: true });
}
