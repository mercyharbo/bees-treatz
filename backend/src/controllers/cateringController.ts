import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import {
  sendCateringInquiryConfirmationEmail,
  sendCateringInquiryAdminAlertEmail,
} from '../utils/emailService';

export async function createInquiry(req: Request, res: Response) {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      eventType,
      eventDate,
      venueLocation,
      venuePostcode,
      guestCount,
      services,
      budgetRange,
      dietaryNotes,
      stylingNotes,
    } = req.body;

    // 1. Validation
    if (!clientName || typeof clientName !== 'string' || !clientName.trim()) {
      return res.status(400).json({ error: 'Please provide your full name.' });
    }

    if (!clientEmail || typeof clientEmail !== 'string' || !clientEmail.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!clientPhone || typeof clientPhone !== 'string' || !clientPhone.trim()) {
      return res.status(400).json({ error: 'Please provide a contact phone number.' });
    }

    if (!eventType || typeof eventType !== 'string') {
      return res.status(400).json({ error: 'Please select an event type.' });
    }

    if (!eventDate) {
      return res.status(400).json({ error: 'Please provide the planned event date.' });
    }

    const parsedEventDate = new Date(eventDate);
    if (isNaN(parsedEventDate.getTime())) {
      return res.status(400).json({ error: 'Please provide a valid event date.' });
    }

    const parsedGuestCount = Number(guestCount);
    if (isNaN(parsedGuestCount) || parsedGuestCount < 1) {
      return res.status(400).json({ error: 'Please provide an estimated guest count.' });
    }

    const normalizedServices = Array.isArray(services) && services.length > 0
      ? services
      : ['Full Catering'];

    // 2. Persist in database
    const inquiry = await prisma.cateringInquiry.create({
      data: {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim().toLowerCase(),
        clientPhone: clientPhone.trim(),
        eventType: eventType.trim(),
        eventDate: parsedEventDate,
        venueLocation: (venueLocation || '').trim() || 'London & Surrounding Areas',
        venuePostcode: (venuePostcode || '').trim() || null,
        guestCount: parsedGuestCount,
        services: JSON.stringify(normalizedServices),
        budgetRange: (budgetRange || '').trim() || null,
        dietaryNotes: (dietaryNotes || '').trim() || null,
        stylingNotes: (stylingNotes || '').trim() || null,
        status: 'NEW',
      },
    });

    // 3. Dispatch transactional emails (non-blocking)
    const formattedDate = parsedEventDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    sendCateringInquiryConfirmationEmail({
      clientName: inquiry.clientName,
      clientEmail: inquiry.clientEmail,
      eventType: inquiry.eventType,
      eventDate: formattedDate,
      guestCount: inquiry.guestCount,
      services: normalizedServices,
    }).catch((err) => console.error('Failed to send inquiry confirmation email:', err));

    sendCateringInquiryAdminAlertEmail({
      id: inquiry.id,
      clientName: inquiry.clientName,
      clientEmail: inquiry.clientEmail,
      clientPhone: inquiry.clientPhone,
      eventType: inquiry.eventType,
      eventDate: formattedDate,
      venueLocation: inquiry.venueLocation,
      venuePostcode: inquiry.venuePostcode,
      guestCount: inquiry.guestCount,
      services: normalizedServices,
      budgetRange: inquiry.budgetRange,
      dietaryNotes: inquiry.dietaryNotes,
      stylingNotes: inquiry.stylingNotes,
    }).catch((err) => console.error('Failed to send inquiry admin alert email:', err));

    return res.status(201).json({
      success: true,
      message: 'Catering inquiry submitted successfully. Chef Bee will reach out shortly!',
      inquiry: {
        id: inquiry.id,
        clientName: inquiry.clientName,
        clientEmail: inquiry.clientEmail,
        eventType: inquiry.eventType,
        eventDate: inquiry.eventDate,
        guestCount: inquiry.guestCount,
        status: inquiry.status,
      },
    });
  } catch (error) {
    console.error('Error creating catering inquiry:', error);
    return res.status(500).json({ error: 'Failed to submit catering inquiry. Please try again later.' });
  }
}

export async function getInquiries(req: Request, res: Response) {
  try {
    const inquiries = await prisma.cateringInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const parsedInquiries = inquiries.map((item) => ({
      ...item,
      services: (() => {
        try {
          return JSON.parse(item.services);
        } catch {
          return [item.services];
        }
      })(),
    }));

    return res.json({ inquiries: parsedInquiries });
  } catch (error) {
    console.error('Error fetching catering inquiries:', error);
    return res.status(500).json({ error: 'Failed to fetch catering inquiries.' });
  }
}

export async function updateInquiryStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['NEW', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'DECLINED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await prisma.cateringInquiry.update({
      where: { id },
      data: { status },
    });

    return res.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return res.status(500).json({ error: 'Failed to update catering inquiry status.' });
  }
}
