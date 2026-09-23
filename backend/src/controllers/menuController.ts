import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function getMenuHandler(req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        items: {
          include: {
            optionGroups: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('getMenuHandler error:', error);
    res.status(500).json({ error: 'Failed to fetch menu.' });
  }
}

export async function getMenuItemHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        optionGroups: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!item) {
      res.status(404).json({ error: 'Menu item not found.' });
      return;
    }

    res.json({ success: true, item });
  } catch (error) {
    console.error('getMenuItemHandler error:', error);
    res.status(500).json({ error: 'Failed to fetch menu item.' });
  }
}

export async function toggleItemAvailabilityHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      res.status(400).json({ error: 'isAvailable boolean is required.' });
      return;
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });

    res.json({ success: true, item: updated });
  } catch (error) {
    console.error('toggleItemAvailabilityHandler error:', error);
    res.status(500).json({ error: 'Failed to update item availability.' });
  }
}
