import {
  CateringPackageItem,
  CateringServicePillar,
  CateringStoryPillar,
  CateringEventTypeItem,
  CateringFaqItem,
} from '@/types/catering';

export const MOCK_CATERING_STORY_PILLARS: CateringStoryPillar[] = [
  {
    number: '01',
    title: '100% Certified Halal',
    description:
      'All our poultry, beef, lamb, and pantry ingredients are strictly certified Halal, ensuring an inclusive, worry-free dining experience for all wedding and corporate guests.',
  },
  {
    number: '02',
    title: 'Artisan Food Styling',
    description:
      'We style every grazing table and platter like an editorial centerpiece — with cascading grapes, honeycomb, edible florals, custom props, and luxury tableware.',
  },
  {
    number: '03',
    title: 'Mobile Bar & Mixology',
    description:
      'Our bespoke mobile bar setups feature custom mixologists, champagne towers, and signature African-inspired mocktails like Zobo Spritz and Chapman Fizz.',
  },
];

export const MOCK_CATERING_PILLARS: CateringServicePillar[] = [
  {
    id: 'grazing-tables',
    title: 'Halal Grazing Tables & Food Styling',
    tag: 'Signature Showstopper',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    description:
      'Lush, multi-tiered displays with cured Halal deli meats, artisan cheeses, fresh fruits, and custom floral styling.',
    features: [
      'Available in Flat-Lay or Multi-Tiered Acrylic Risers',
      'Custom Fresh Florals to match your wedding color scheme',
      '100% Certified Halal meats & gourmet cheeses',
      'Ideal for reception drinks, cocktail hours & birthdays',
    ],
    price: 'From £350 (Flat-Lay) / £25 per head',
    serviceKey: 'Grazing Table',
  },
  {
    id: 'canapes',
    title: 'Afro-Fusion Canapés & Small Chops',
    tag: 'Cocktail & Finger Food',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    description:
      'Exquisite bite-sized Nigerian delicacies crafted for elegant standing receptions, corporate events, and wedding cocktail hours.',
    features: [
      'Mini Gourmet Meat Pies & Scotch Eggs',
      'Plantain Cups with Shredded Asun & Prawn Suya Skewers',
      'Puff-Puff Skewers with Cinnamon & Honey Drizzle',
      'Hot & Cold Butler-style roaming service available',
    ],
    price: 'From £18 per guest (5 varieties)',
    serviceKey: 'Canapés',
  },
  {
    id: 'mobile-bar',
    title: 'Mobile Bar & Signature Mixology',
    tag: 'Drinks Experience',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    description:
      'A chic mobile bar with dedicated mixologists serving handcrafted African-inspired mocktails, cocktails, and champagne fountains.',
    features: [
      'Signature Zobo Spritz & Sparking Chapman Fizz',
      'Hibiscus Mojito & Tropical Passionfruit Punch',
      'Customized Drink Menu with Event Branding',
      'Alcoholic & 100% Non-Alcoholic / Halal Bar Packages',
    ],
    price: 'From £295 setup + drink packages',
    serviceKey: 'Mobile Bar',
  },
];

export const MOCK_CATERING_PACKAGES: CateringPackageItem[] = [
  // Grazing Tables
  {
    id: 'pkg-grazing-flat',
    category: 'grazing',
    title: 'The Signature Flat-Lay Grazing Table',
    serves: '1.5 Meters · Serves 25–40 Guests',
    price: 'From £350',
    tag: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    description:
      'Lush flat-lay display featuring certified Halal charcuterie, artisan cheeses, roasted plantain crisps, honeycomb, spiced suya skewers, and foliage.',
    inclusions: [
      'Halal beef & turkey charcuterie',
      'Mild suya skewers & mini puff puff',
      'Assorted crackers, dips & seasonal berries',
      'Floral and foliage table styling',
    ],
    serviceKey: 'Grazing Table',
  },
  {
    id: 'pkg-grazing-tiered',
    category: 'grazing',
    title: 'The Grand Tiered Luxury Grazing Table',
    serves: '3+ Meters · Serves 60–120 Guests',
    price: 'From £750',
    tag: 'Wedding Favorite',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description:
      'Multi-level architectural display with acrylic pedestals, bespoke floral centerpieces, gourmet Halal meats, artisan breads, and savory African delicacies.',
    inclusions: [
      'Multi-level tiered styling & props',
      'Large savory & sweet dessert integration',
      'Custom floral styling matching event colors',
      'Dedicated on-site setup team (2.5 hrs)',
    ],
    serviceKey: 'Grazing Table',
  },

  // Canapés & Small Chops
  {
    id: 'pkg-canapes-luxury',
    category: 'canapes',
    title: 'The Afro-Fusion Canapé Reception',
    serves: '50 – 200 Guests',
    price: 'From £18 / guest',
    tag: 'Cocktail Hour',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    description:
      'A refined selection of 5 gourmet bite-sized Nigerian finger foods served warm or at ambient temperature for standing receptions.',
    inclusions: [
      'Mini Nigerian Puff-Puff with salted caramel or honey',
      'Plantain tartlets with shredded peppered beef',
      'Glazed goat meat suya bites on bamboo picks',
      'Mini flaky beef & chicken hand pies',
    ],
    serviceKey: 'Canapés',
  },
  {
    id: 'pkg-canapes-smallchops',
    category: 'canapes',
    title: 'The Classic Small Chops Platter Box',
    serves: 'Serves 15–20 Guests per Platter',
    price: '£85 per platter',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=800&q=80',
    description:
      'Generous luxury platter containing 60+ fresh pieces of Nigerian party favorites, garnished with fresh scotch bonnets and spring onions.',
    inclusions: [
      '20x Fluffy golden Puff-Puff',
      '15x Savory Mini Meat Pies',
      '15x Spiced Spring Rolls & Samosas',
      '15x Peppered Gizzard Skewers',
    ],
    serviceKey: 'Canapés',
  },

  // Mobile Bar & Mocktails
  {
    id: 'pkg-bar-mocktail',
    category: 'bar',
    title: 'The Artisan Naija Mocktail Bar',
    serves: '3 Hours · Up to 100 Guests',
    price: 'From £395',
    tag: '100% Halal Experience',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    description:
      'Full mobile bar unit with dedicated professional mixologist serving signature virgin cocktails infused with authentic African botanicals.',
    inclusions: [
      'Signature Zobo Spritz (Hibiscus & Cinnamon)',
      'Sparkling Chapman Fizz with Angostura aroma',
      'Tropical Passionfruit & Mango Cooler',
      'Branded bar setup, glassware & floral garnish',
    ],
    serviceKey: 'Mobile Bar',
  },
  {
    id: 'pkg-bar-cocktail',
    category: 'bar',
    title: 'The Full Celebration Cocktail & Champagne Bar',
    serves: '4 Hours · Up to 150 Guests',
    price: 'From £650',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    description:
      'Complete bar service including mixologists, premium spirits, Prosecco/Champagne reception tower, custom bar menu sign, and ice service.',
    inclusions: [
      'Two professional mixologists',
      'Prosecco / Champagne tower setup',
      'Custom his & hers signature cocktails',
      'Complete bar kit, ice, and premium glassware',
    ],
    serviceKey: 'Mobile Bar',
  },

  // Food Bowls & Banquets
  {
    id: 'pkg-bowls-party',
    category: 'bowls',
    title: 'Large-Format Party Soup Bowls (4 Litres)',
    serves: 'Serves 15–20 Guests per Tub',
    price: 'From £95 per tub',
    tag: 'Pre-Order Kitchen',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    description:
      '4-Litre party feast tubs of authentic Nigerian soups simmered slow with crayfish, locust beans, and your choice of goat meat or fish.',
    inclusions: [
      'Egusi, Seafood Okro, Ogbono, or Efo Riro',
      'Choice of swallow (Pounded Yam or Eba)',
      'Generous cuts of slow-cooked halal meats',
      'Requires 48h advance kitchen notice',
    ],
    serviceKey: 'Food Bowls',
  },
  {
    id: 'pkg-bowls-rice-tray',
    category: 'bowls',
    title: 'Smoky Firewood Jollof Mega Party Tray',
    serves: 'Serves 25–30 Guests',
    price: '£110 per tray',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    description:
      'Authentic firewood-style party jollof rice cooked in seasoned beef stock, plum tomatoes, red peppers, and aromatic spices.',
    inclusions: [
      'Deep smoky aroma and rich party flavor',
      'Option to pair with fried plantains (Dodo)',
      'Served in thermal-insulated party cater trays',
      'Ready to serve warm at your venue',
    ],
    serviceKey: 'Food Bowls',
  },
];

export const MOCK_CATERING_EVENT_TYPES: CateringEventTypeItem[] = [
  {
    title: 'Weddings & Engagements',
    subtitle: 'Nikah · Traditional Owambe · Reception Grazing',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description:
      'Transform your special day into a royal feast with Halal grazing tables for your drinks reception, traditional Nigerian banquets, and champagne mocktail towers.',
    badge: 'Bespoke Tastings Available',
    eventVal: 'Wedding',
  },
  {
    title: 'Corporate Events & Galas',
    subtitle: 'Diversity Celebrations · Office Catering · Launches',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    description:
      'Impress colleagues and clients with sophisticated African fusion canapés, boardroom grazing platters, and branded mobile bars with prompt invoicing.',
    badge: 'Corporate Invoicing Available',
    eventVal: 'Corporate Event',
  },
  {
    title: 'Intimate Gatherings & Celebrations',
    subtitle: 'Dinner Parties · Baby Showers · Eid & Birthdays',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    description:
      'Celebrate milestones in the comfort of your home or private venue with styled grazing boards, hot canapé trays, and customized mocktail menus.',
    badge: '48h Minimum Notice',
    eventVal: 'Intimate Gathering',
  },
];

export const MOCK_CATERING_FAQS: CateringFaqItem[] = [
  {
    question: 'Are all your catering items and meats 100% Halal certified?',
    answer:
      'Yes, 100%! Bee’s Treatz is proudly a strictly Halal catering kitchen. All poultry, beef, lamb, goat meat, and pantry ingredients are sourced exclusively from certified UK Halal suppliers, providing complete peace of mind for you and your guests.',
  },
  {
    question: 'How much advance notice is required to book catering?',
    answer:
      'For small private platters and food bowls, we require at least 48 hours notice. For bespoke grazing tables, cocktail canapés, corporate events, and weddings, we recommend inquiring 2 to 4 weeks in advance to ensure date availability on Chef Bee’s kitchen calendar.',
  },
  {
    question: 'Which geographical areas do you service?',
    answer:
      'We regularly cater events throughout Greater London, Kent, Surrey, Essex, and Hertfordshire. For grand weddings and corporate galas, our team travels nationwide across the United Kingdom.',
  },
  {
    question: 'Can you accommodate guests with severe food allergies?',
    answer:
      'Absolutely. In compliance with UK Natasha’s Law, we strictly manage and declare all 14 major allergens (such as peanuts, gluten, dairy, fish, and crustaceans). We can provide segregated allergen-safe platters and gluten-free / vegetarian options upon request.',
  },
  {
    question: 'Do you provide on-site table styling, tableware, and waitstaff?',
    answer:
      'Yes! Our grazing tables and food styling packages include full on-site setup with custom fresh florals, acrylic and wooden display risers, and decorative props. We also offer professional butler-style roaming waitstaff and mobile bar mixologists for the duration of your event.',
  },
];
