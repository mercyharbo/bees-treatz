import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { CreateOrderInput, OrderStatus, PaymentStatus } from '../types';
import { calculateDeliveryEligibility } from '../services/deliveryService';

function generateOrderNumber(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BT-${random}`;
}

export async function createOrderHandler(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as CreateOrderInput;

    if (!body.customerName || !body.customerEmail || !body.customerPhone) {
      res.status(400).json({ error: 'Customer name, email, and phone are required.' });
      return;
    }

    if (!body.items || body.items.length === 0) {
      res.status(400).json({ error: 'Cart is empty. At least one item is required.' });
      return;
    }

    // 1. Fetch menu items from DB to calculate trusted server-side pricing
    const itemIds = body.items.map((i) => i.menuItemId);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
      include: {
        optionGroups: {
          include: {
            options: true,
          },
        },
      },
    });

    const menuMap = new Map(dbMenuItems.map((item) => [item.id, item]));

    let calculatedSubtotal = 0;
    const preparedOrderItems: Array<{
      menuItemId: string;
      itemName: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
      selectedOptions: any;
    }> = [];

    for (const itemInput of body.items) {
      const dbItem = menuMap.get(itemInput.menuItemId);
      if (!dbItem) {
        res.status(400).json({ error: `Item not found: ${itemInput.menuItemId}` });
        return;
      }
      if (!dbItem.isAvailable) {
        res.status(400).json({ error: `"${dbItem.name}" is currently sold out.` });
        return;
      }

      let itemUnitPrice = dbItem.basePrice;
      const verifiedOptions: any[] = [];

      if (itemInput.selectedOptions && itemInput.selectedOptions.length > 0) {
        for (const selOpt of itemInput.selectedOptions) {
          // Find option group & option in dbItem
          const group = dbItem.optionGroups.find((g) => g.name === selOpt.groupName);
          const opt = group?.options.find((o) => o.name === selOpt.optionName);

          if (opt) {
            itemUnitPrice += opt.additionalPrice;
            verifiedOptions.push({
              groupName: group!.name,
              optionName: opt.name,
              additionalPrice: opt.additionalPrice,
            });
          }
        }
      }

      const itemTotal = Math.round(itemUnitPrice * itemInput.quantity * 100) / 100;
      calculatedSubtotal += itemTotal;

      preparedOrderItems.push({
        menuItemId: dbItem.id,
        itemName: dbItem.name,
        unitPrice: itemUnitPrice,
        quantity: itemInput.quantity,
        totalPrice: itemTotal,
        selectedOptions: verifiedOptions,
      });
    }

    calculatedSubtotal = Math.round(calculatedSubtotal * 100) / 100;

    // 2. Validate Delivery Postcode & Delivery Fee
    let deliveryFee = 0;
    if (body.orderType === 'DELIVERY') {
      if (!body.deliveryPostcode || !body.deliveryAddress) {
        res.status(400).json({ error: 'Delivery address and valid UK postcode are required for delivery.' });
        return;
      }

      const deliveryCheck = await calculateDeliveryEligibility(body.deliveryPostcode, calculatedSubtotal);
      if (!deliveryCheck.valid || !deliveryCheck.eligible) {
        res.status(400).json({
          error: deliveryCheck.reason || 'Sorry, we cannot deliver to this postcode.',
        });
        return;
      }
      deliveryFee = deliveryCheck.deliveryFee;
    }

    const calculatedTotal = Math.round((calculatedSubtotal + deliveryFee) * 100) / 100;

    // 3. Create Order record in DB
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        orderType: body.orderType,
        deliveryAddress: body.deliveryAddress,
        deliveryPostcode: body.deliveryPostcode?.toUpperCase(),
        deliveryFee,
        subtotal: calculatedSubtotal,
        total: calculatedTotal,
        specialInstructions: body.specialInstructions,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        items: {
          create: preparedOrderItems.map((item) => ({
            menuItemId: item.menuItemId,
            itemName: item.itemName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            selectedOptions: item.selectedOptions,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('createOrderHandler error:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  }
}

export async function getOrderByIdHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('getOrderByIdHandler error:', error);
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
}

export async function getAllOrdersHandler(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.query;

    const orders = await prisma.order.findMany({
      where: status ? { status: status as OrderStatus } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
      take: 50,
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('getAllOrdersHandler error:', error);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
}

export async function updateOrderStatusHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      res.status(400).json({ error: 'Invalid order status value.' });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('updateOrderStatusHandler error:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
}
