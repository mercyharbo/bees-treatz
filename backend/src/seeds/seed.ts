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
      name: 'Rice Dishes & Party Trays',
      slug: 'rice-and-mains',
      description: 'Signature firewood-style party rice dishes cooked to aromatic perfection, available in single portions and mega cater trays.',
      displayOrder: 2,
    },
  });

  const catGrills = await prisma.category.create({
    data: {
      name: 'Grills & Small Chops',
      slug: 'grills-and-small-chops',
      description: 'Fiery suya skewers, peppered meats, and authentic Nigerian finger foods.',
      displayOrder: 3,
    },
  });

  const catDrinks = await prisma.category.create({
    data: {
      name: 'Chilled Drinks & Mocktails',
      slug: 'drinks',
      description: 'Freshly brewed Zobo elixir, sparkling Chapman, and African beverages.',
      displayOrder: 4,
    },
  });

  // Reusable Option Sets for Soups
  const tubSizeOptions = [
    { name: 'Standard Single Bowl (750ml)', additionalPrice: 0.0 },
    { name: 'Family Feast Tub (2 Litres)', additionalPrice: 25.0 },
    { name: 'Mega Party Feast Tub (4 Litres)', additionalPrice: 55.0 },
  ];

  const swallowOptions = [
    { name: 'Pounded Yam', additionalPrice: 0.0 },
    { name: 'Eba (Garri)', additionalPrice: 0.0 },
    { name: 'Amala (Yam Flour)', additionalPrice: 0.0 },
    { name: 'Semovita', additionalPrice: 0.0 },
    { name: 'None (Soup Only)', additionalPrice: 0.0 },
  ];

  const soupProteinOptions = [
    { name: 'Assorted Meats (Shaki, Abodi, Beef)', additionalPrice: 0.0 },
    { name: 'Slow-Cooked Goat Meat', additionalPrice: 2.5 },
    { name: 'Fried Tilapia Fish', additionalPrice: 2.0 },
    { name: 'Fresh Catfish (Point & Kill)', additionalPrice: 3.5 },
    { name: 'Hard Chicken', additionalPrice: 1.5 },
  ];

  const spiceLevels = [
    { name: 'Mild (Gentle Warmth)', additionalPrice: 0.0 },
    { name: 'Medium (Classic Naija Spice)', additionalPrice: 0.0 },
    { name: 'Fiery Hot (Authentic Lagos Street Heat)', additionalPrice: 0.0 },
  ];

  const standardSoupOptionGroups = [
    {
      name: 'Tub / Portion Size',
      required: true,
      minSelect: 1,
      maxSelect: 1,
      options: { create: tubSizeOptions },
    },
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
  ];

  // 4. Seed Dishes: Soups
  await prisma.menuItem.create({
    data: {
      categoryId: catSoups.id,
      name: "Bee's Special Egusi Soup",
      slug: 'bees-special-egusi-soup',
      description: 'Ground melon seeds slow-simmered with spinach, bitterleaf, grounded crayfish, and iru (locust beans). Rich and aromatic.',
      basePrice: 14.50,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify(['Fish', 'Crustaceans']),
      optionGroups: { create: standardSoupOptionGroups },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catSoups.id,
      name: 'Efo Riro Elegusi Deluxe',
      slug: 'efo-riro-elegusi',
      description: 'Vibrant Lagos-style spinach vegetable soup prepared with palm oil, smoked dried fish, and rich aromatic peppers.',
      basePrice: 15.00,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify(['Fish', 'Crustaceans']),
      optionGroups: { create: standardSoupOptionGroups },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catSoups.id,
      name: 'Authentic Seafood Okro Soup',
      slug: 'authentic-seafood-okro',
      description: 'Finely diced crunchy okra simmered with jumbo king prawns, blue crab, fresh calamari, and scotch bonnets.',
      basePrice: 16.50,
      imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify(['Fish', 'Crustaceans', 'Molluscs']),
      optionGroups: { create: standardSoupOptionGroups },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catSoups.id,
      name: 'Ogbono Soup (Draw Soup)',
      slug: 'ogbono-soup',
      description: 'Traditional wild mango seed stew with herbs, stockfish, and aromatic seasoning. Silky and deeply flavorful.',
      basePrice: 14.00,
      imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop',
      isSpicy: false,
      allergens: JSON.stringify(['Fish', 'Crustaceans']),
      optionGroups: { create: standardSoupOptionGroups },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catSoups.id,
      name: 'Delta Style Banga Soup (Palm Nut)',
      slug: 'delta-banga-soup',
      description: 'Rich palm nut fruit extract seasoned with authentic Delta aromatic herbs (Oburunbebe stick, Beletete).',
      basePrice: 15.50,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify(['Fish', 'Crustaceans']),
      optionGroups: { create: standardSoupOptionGroups },
    },
  });

  // 5. Seed Dishes: Rice Dishes & Party Trays
  const ricePortionOptions = [
    { name: 'Individual Portion (Serves 1)', additionalPrice: 0.0 },
    { name: 'Family Tray (Serves 4–6)', additionalPrice: 26.0 },
    { name: 'Mega Party Cater Tray (Serves 25–30)', additionalPrice: 98.50 },
  ];

  const riceProteinOptions = [
    { name: 'Crispy Fried Chicken', additionalPrice: 0.0 },
    { name: 'Peppered Beef', additionalPrice: 1.5 },
    { name: 'Fried Croaker Fish', additionalPrice: 2.0 },
    { name: 'Grilled Jumbo Turkey Wing', additionalPrice: 2.5 },
  ];

  await prisma.menuItem.create({
    data: {
      categoryId: catRice.id,
      name: 'Smoky Lagos Firewood Party Jollof',
      slug: 'smoky-lagos-party-jollof',
      description: 'Long-grain parboiled rice cooked in roasted plum tomatoes, bell peppers, scotch bonnets, and sweet onions. Infused with firewood smokiness, served with sweet fried plantain (Dodo).',
      basePrice: 11.50,
      imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify([]),
      optionGroups: {
        create: [
          {
            name: 'Portion / Tray Size',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            options: { create: ricePortionOptions },
          },
          {
            name: 'Choose Your Protein',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            options: { create: riceProteinOptions },
          },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catRice.id,
      name: 'Native Asun & Basmati Jollof Rice',
      slug: 'native-asun-jollof-rice',
      description: 'Rich village-style jollof rice cooked with smoked crayfish, dried prawns, and tender chunks of peppered goat meat.',
      basePrice: 14.50,
      imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop',
      isSpicy: true,
      allergens: JSON.stringify(['Fish', 'Crustaceans']),
      optionGroups: {
        create: [
          {
            name: 'Portion / Tray Size',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            options: { create: ricePortionOptions },
          },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catRice.id,
      name: 'Nigerian Special Fried Rice with Prawns',
      slug: 'nigerian-special-fried-rice',
      description: 'Wok-tossed rice with sweet corn, carrots, green beans, tender liver bites, and king prawns in fragrant chicken broth.',
      basePrice: 12.50,
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop',
      isSpicy: false,
      allergens: JSON.stringify(['Crustaceans']),
      optionGroups: {
        create: [
          {
            name: 'Portion / Tray Size',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            options: { create: ricePortionOptions },
          },
          {
            name: 'Choose Your Protein',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            options: { create: riceProteinOptions },
          },
        ],
      },
    },
  });

  // 6. Seed Dishes: Grills & Small Chops
  await prisma.menuItem.create({
    data: {
      categoryId: catGrills.id,
      name: "Bee's Special Beef Suya",
      slug: 'bees-beef-suya',
      description: 'Thinly sliced British beef skewers coated in northern Nigerian Yaji dry rub (kuli-kuli peanuts, ginger, garlic, cayenne). Grilled over flame and served with red onions and tomatoes.',
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
      name: 'Warm Golden Puff-Puff Box (10 pcs)',
      slug: 'warm-puff-puff-box',
      description: 'Fluffy golden Nigerian dough balls with a sweet crispy exterior and soft airy interior. Scented with nutmeg.',
      basePrice: 5.50,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
      isVegetarian: true,
      allergens: JSON.stringify(['Gluten']),
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catGrills.id,
      name: 'Flaky Nigerian Meat Pies (2 pcs)',
      slug: 'nigerian-meat-pies',
      description: 'Buttery, golden shortcrust pastry filled with minced beef, diced potatoes, and savory carrots.',
      basePrice: 6.50,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=800&auto=format&fit=crop',
      allergens: JSON.stringify(['Gluten']),
    },
  });

  // 7. Seed Drinks
  await prisma.menuItem.create({
    data: {
      categoryId: catDrinks.id,
      name: 'Freshly Brewed Zobo Elixir (1-Litre Bottle)',
      slug: 'fresh-zobo-elixir-1l',
      description: 'Organic dried Roselle hibiscus leaves simmered with spicy ginger, cloves, and natural pineapple juice. Served ice chilled.',
      basePrice: 7.50,
      imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop',
      isVegetarian: true,
      allergens: JSON.stringify([]),
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catDrinks.id,
      name: 'Bee’s Signature Chapman (1-Litre Bottle)',
      slug: 'bees-chapman-1l',
      description: 'The iconic Nigerian party mocktail! Sparkling red citrus drink infused with Angostura bitters, lime, and cucumber notes.',
      basePrice: 8.00,
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop',
      allergens: JSON.stringify([]),
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: catDrinks.id,
      name: 'Tropical Passionfruit & Mango Cooler (500ml)',
      slug: 'passionfruit-mango-cooler',
      description: 'Cold-pressed passionfruit puree blended with sweet Alphonso mango and sparkling mineral water.',
      basePrice: 4.50,
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop',
      isVegetarian: true,
      allergens: JSON.stringify([]),
    },
  });

  console.log('✅ Menu and categories seeded successfully with full Nigerian culinary options!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
