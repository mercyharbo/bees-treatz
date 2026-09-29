import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_BASE_URL = (
  process.env.API_URL || 'https://bees-treatz.onrender.com/api'
).replace(/\/$/, '');

function parseAllergens(allergens: unknown): string[] {
  if (Array.isArray(allergens)) return allergens;
  if (typeof allergens === 'string') {
    try {
      const parsed = JSON.parse(allergens);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return allergens ? [allergens] : [];
    }
  }
  return [];
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required.' }, { status: 400 });
    }

    // 1. Primary: Try dedicated backend endpoint /api/menu-details/:slug
    try {
      const directRes = await fetch(`${BACKEND_BASE_URL}/menu-details/${slug}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (directRes.ok) {
        const data = await directRes.json();
        if (data?.item) {
          data.item.allergens = parseAllergens(data.item.allergens);
        }
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn('Direct /menu-details/:slug fetch error, falling back:', e);
    }

    // 2. Fallback: Search menu catalog to resolve slug to UUID, then fetch full item options
    const menuRes = await fetch(`${BACKEND_BASE_URL}/menu`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!menuRes.ok) {
      return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });
    }

    const menuData = await menuRes.json();
    let matchedItem: { id: string; slug: string; name: string } | null = null;
    let categoryName = '';

    for (const cat of menuData.categories || []) {
      const found = cat.items?.find(
        (i: { id: string; slug: string }) => i.slug === slug || i.id === slug
      );
      if (found) {
        matchedItem = found;
        categoryName = cat.name;
        break;
      }
    }

    if (!matchedItem) {
      return NextResponse.json({ error: 'Menu item details not found.' }, { status: 404 });
    }

    // Fetch full option groups via item ID
    const itemRes = await fetch(`${BACKEND_BASE_URL}/menu/${matchedItem.id}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!itemRes.ok) {
      return NextResponse.json({ error: 'Menu item details not found.' }, { status: 404 });
    }

    const itemData = await itemRes.json();
    const item = itemData.item;

    if (item) {
      item.allergens = parseAllergens(item.allergens);
      if (!item.category && categoryName) {
        item.category = { name: categoryName };
      }
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Menu details route error:', error);
    return NextResponse.json({ error: 'Failed to retrieve menu item details.' }, { status: 500 });
  }
}
