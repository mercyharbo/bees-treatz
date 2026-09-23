import { PrismaClient } from '@prisma/client';
import { AdminRole } from '../types';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Bee's Treatz Database...");

  // 1. Create Default Admin User
  const adminEmail = 'admin@beestreatz.co.uk';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('AdminPass123!', 10);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "Chef Bee",
        role: AdminRole.ADMIN,
      },
    });
    console.log(`✅ Created Admin User: ${adminEmail} (Password: AdminPass123!)`);
  }

  // 2. Clear previous menu data for clean idempotent seed
  await prisma.option.deleteMany();
  await prisma.optionGroup.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  // 3. Create Categories
  const catSoups = await prisma.category.create({
    data: {
      name: 'Traditional Soups & Swallows',
      slug: 'soups-and-swallows',
      description: 'Authentic Nigerian soups cooked slow with crayfish and locust beans, paired with your choice of swallow and meat.',
      displayOrder: 1,
    },
  });

  const catRice = await prisma.category.create({
    data: {
      name: 'Rice Dishes & Mains',
      slug: 'rice-and-mains',
      description: 'Signature party-style rice dishes cooked to aromatic perfection.',
      displayOrder: 2,
    },
  });

  const catGrills = await prisma.category.create({
    data: {
      name: 'Grills & Small Chops',
      slug: 'grills-and-small-chops',
      description: 'Fiery suya, peppered meats, and authentic finger foods.',
      displayOrder: 3,
    },
  });

  const catDrinks = await prisma.category.create({
    data: {
      name: 'Chilled Drinks & Mocktails',
      slug: 'drinks',
      description: 'Traditional zobo, refreshing Chapman, and cold African beverages.',
      displayOrder: 4,
    },
  });

  // Reusable Option Sets for Soups
  const swallowOptions = [
    { name: 'Pounded Yam', additionalPrice: 0.0 },
    { name: 'Eba (Garri)', additionalPrice: 0.0 },
    { name: 'Amala (Yam Flour)', additionalPrice: 0.0 },
    { name: 'Semo', additionalPrice: 0.0 },
    { name: 'Extra Pounded Yam', additionalPrice: 3.0 },
  ];

  const soupProteinOptions = [
    { name: 'Assorted Meats (Shaki, Abodi, Beef)', additionalPrice: 0.0 },
    { name: 'Slow Cooked Goat Meat', additionalPrice: 2.0 },
    { name: 'Fried Tilapia Fish', additionalPrice: 1.5 },
    { name: 'Fresh Catfish (Point & Kill)', additionalPrice: 3.5 },
    { name: 'Hard Chicken', additionalPrice: 1.0 },
  ];

  const spiceLevels = [
    { name: 'Mild (English Friendly)', additionalPrice: 0.0 },
    { name: 'Medium (Standard Naija Spice)', additionalPrice: 0.0 },
    { name: 'Fiery Hot (Authentic Lagos Street Heat)', additionalPrice: 0.0 },
  ];

  // 4. Seed Dishes: Soups
  const egusi = await prisma.menuItem.create({
    data: {
      categoryId: catSoups.id,
      name: "Bee's Special Egusi Soup",
      slug: 'bees-special-egusi-soup',
      description: 'Ground melon seeds slow-simmered with spinach, bitterleaf, grounded crayfish, and iru (locust beans). Served with your choice of swallow and protein.',
      basePrice: 14.50,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify(['Fish', 'Crustaceans']),
      optionGroups: {
        create: [
          {
            name: 'Choose Your Swallow',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            options: { create: swallowOptions },
          },
          {
            name: 'Choose Your Protein',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            options: { create: soupProteinOptions },
          },
          {
            name: 'Spice Level',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            options: { create: spiceLevels },
          },
        ],
      },
    },
  });

  const efoRiro = await prisma.menuItem.create({
    data: {
      categoryId: catSoups.id,
      name: 'Efo Riro Elegusi Deluxe',
      slug: 'efo-riro-elegusi',
      description: 'Vibrant Lagos-style spinach vegetable soup prepared with palm oil, smoked dried fish, and rich aromatic peppers.',
      basePrice: 15.00,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify(['Fish', 'Crustaceans']),
      optionGroups: {
        create: [
          {
            name: 'Choose Your Swallow',
            required: true,
            options: { create: swallowOptions },
          },
          {
            name: 'Choose Your Protein',
            required: true,
            options: { create: soupProteinOptions },
          },
          {
            name: 'Spice Level',
            required: true,
            options: { create: spiceLevels },
          },
        ],
      },
    },
  });

  const ogbono = await prisma.menuItem.create({
    data: {
      categoryId: catSoups.id,
      name: 'Ogbono Soup (Draw Soup)',
      slug: 'ogbono-soup',
      description: 'Traditional wild mango seed stew with traditional herbs, stockfish, and aromatic seasoning.',
      basePrice: 14.00,
      imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop',
      isSpicy: false,
      allergens: JSON.stringify(['Fish', 'Crustaceans']),
      optionGroups: {
        create: [
          {
            name: 'Choose Your Swallow',
            required: true,
            options: { create: swallowOptions },
          },
          {
            name: 'Choose Your Protein',
            required: true,
            options: { create: soupProteinOptions },
          },
        ],
      },
    },
  });

  // 5. Seed Dishes: Rice
  await prisma.menuItem.create({
    data: {
      categoryId: catRice.id,
      name: 'Smoky Lagos Party Jollof',
      slug: 'smoky-lagos-party-jollof',
      description: 'Long-grain parboiled rice cooked in a rich blend of roasted plum tomatoes, bell peppers, scotch bonnets, and sweet onions. Infused with firewood smokiness, served with sweet fried plantain (Dodo).',
      basePrice: 11.50,
      imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify([]),
      optionGroups: {
        create: [
          {
            name: 'Choose Your Protein',
            required: true,
            options: {
              create: [
                { name: 'Crispy Fried Chicken', additionalPrice: 0.0 },
                { name: 'Peppered Beef', additionalPrice: 1.0 },
                { name: 'Fried Croaker Fish', additionalPrice: 2.0 },
                { name: 'Grilled Jumbo Turkey', additionalPrice: 2.5 },
              ],
            },
          },
          {
            name: 'Extra Sides',
            required: false,
            minSelect: 0,
            maxSelect: 3,
            options: {
              create: [
                { name: 'Extra Fried Plantain (Dodo)', additionalPrice: 3.0 },
                { name: 'Creamy Coleslaw', additionalPrice: 2.5 },
                { name: 'Moi Moi (Steamed Bean Cake)', additionalPrice: 3.5 },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catRice.id,
      name: 'Designer Ayamase & Ofada Rice',
      slug: 'ayamase-ofada-rice',
      description: 'Fragrant short-grain Ofada brown rice served with bleached palm oil green pepper sauce (Designer Stew), boiled eggs, and chopped offals.',
      basePrice: 14.50,
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify(['Eggs', 'Fish']),
    },
  });

  // 6. Seed Dishes: Grills & Small Chops
  await prisma.menuItem.create({
    data: {
      categoryId: catGrills.id,
      name: "Bee's Special Beef Suya",
      slug: 'bees-beef-suya',
      description: 'Thinly sliced British beef skewers coated in northern Nigerian Yaji dry rub (ground kuli-kuli peanuts, ginger, garlic, cayenne). Grilled over open flame and served with red onions and fresh tomatoes.',
      basePrice: 8.50,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify(['Peanuts']),
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catGrills.id,
      name: 'Spicy Asun (Peppered Goat Meat)',
      slug: 'spicy-asun',
      description: 'Bite-sized roasted tender goat meat sautéed with fiery habaneros and sweet bell peppers.',
      basePrice: 10.50,
      imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify([]),
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catGrills.id,
      name: 'Warm Puff-Puff Box (6 pcs)',
      slug: 'warm-puff-puff-box',
      description: 'Golden fried Nigerian dough balls with a fluffy inside and sweet crispy exterior. Hint of nutmeg.',
      basePrice: 4.50,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
      isVegetarian: true,
      allergens: JSON.stringify(['Gluten']),
    },
  });

  // 7. Seed Drinks
  await prisma.menuItem.create({
    data: {
      categoryId: catDrinks.id,
      name: 'Bee’s Signature Chapman (500ml)',
      slug: 'bees-chapman',
      description: 'The national drink of Nigerian parties! Sparkling red mocktail with Angostura bitters, citrus, and cucumber garnish.',
      basePrice: 4.50,
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop',
      allergens: JSON.stringify([]),
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catDrinks.id,
      name: 'Freshly Brewed Zobo Elixir (500ml)',
      slug: 'fresh-zobo-elixir',
      description: 'Organic dried Roselle hibiscus leaves simmered with spicy ginger, cloves, and natural pineapple juice. Served chilled.',
      basePrice: 4.00,
      imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop',
      isVegetarian: true,
      allergens: JSON.stringify([]),
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catDrinks.id,
      name: 'Supermalt (330ml Can)',
      slug: 'supermalt-can',
      description: 'Classic non-alcoholic malt beverage rich in B-vitamins.',
      basePrice: 2.50,
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop',
      allergens: JSON.stringify(['Gluten']),
    },
  });

  console.log('✅ Menu and categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
