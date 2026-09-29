import { Product, Review } from '@/types';

export const CURRENCY_SYMBOL = 'GH₵';

export const CATEGORIES = [
  {
    id: 'skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Potent botanicals and clinical actives crafted in Sunyani for an effortless glass-skin glow.',
    image: '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg',
    itemCount: 12,
  },
  {
    id: 'makeup',
    name: 'Makeup & Complexion',
    slug: 'makeup',
    description: 'Weightless formulas designed to enhance your natural beauty.',
    image: '/beautyImages/cadd9c6e24c20cf8e79f77ff3f1e9c49.jpg',
    itemCount: 16,
  },
  {
    id: 'fragrance',
    name: 'Fine Fragrance',
    slug: 'fragrance',
    description: 'Sensory perfumes blending West African florals and modern tropical woods.',
    image: '/beautyImages/bd545c8751f20e872e51fc45f870cc99.jpg',
    itemCount: 8,
  },
  {
    id: 'body',
    name: 'Bath & Body',
    slug: 'body',
    description: 'Silken body elixirs and scrubs infused with antioxidant oils.',
    image: '/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg',
    itemCount: 9,
  },
  {
    id: 'sets',
    name: 'Curated Sets & Gifts',
    slug: 'sets',
    description: 'Award-winning discovery routines and exclusive seasonal bundles.',
    image: '/beautyImages/cc.jpg',
    itemCount: 6,
  },
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'cc-01',
    slug: 'lumiere-hydra-dew-serum',
    name: 'Lumière Hydra-Dew Serum',
    subtitle: 'Triple-Hyaluronic & Niacinamide Plumping Elixir',
    category: 'skincare',
    price: 850.0,
    compareAtPrice: 1050.0,
    rating: 4.9,
    reviewCount: 342,
    images: [
      '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg',
      '/beautyImages/34452e2fc3a3d0262d96d96e2c62e95d.jpg',
    ],
    description:
      'An ultra-concentrated hydration catalyst designed to flood skin with deep cellular moisture. Formulated with three molecular weights of hyaluronic acid, 5% niacinamide, and natural shea butter extract for an instant lit-from-within glow.',
    benefits: [
      'Delivers 72-hour continuous, weightless hydration',
      'Visibly reduces redness and refines pores within 14 days',
      'Strengthens the lipid barrier against urban environmental pollutants',
      'Non-comedogenic and ideal under makeup as a luminous primer',
    ],
    ingredients:
      'Rosa Damascena Flower Water, Sodium Hyaluronate (Multi-Molecular), Niacinamide (5%), Glycerin, Panthenol (Pro-Vitamin B5), Camellia Sinensis (Green Tea) Leaf Extract, Centella Asiatica Extract, Allantoin, Phenoxyethanol, Ethylhexylglycerin.',
    howToUse:
      'After cleansing, dispense 3-4 drops onto damp skin. Gently press into face, neck, and décolleté morning and evening before creams.',
    skinTypes: ['All', 'Dry', 'Sensitive', 'Combination'],
    tags: ['Bestseller', 'Clean', 'Vegan', 'Award Winner'],
    stock: 45,
    isFeatured: true,
  },
  {
    id: 'cc-02',
    slug: 'velvet-matte-silk-lipstick',
    name: 'Lasgidi Fine Mist & Tint Wardrobe',
    subtitle: 'Sensorial Fragrance & Complexion Mists',
    category: 'makeup',
    price: 380.0,
    rating: 4.8,
    reviewCount: 198,
    images: [
      '/beautyImages/cadd9c6e24c20cf8e79f77ff3f1e9c49.jpg',
    ],
    description:
      'Sensorial body mists and complexion tints. Includes Pistachio Crush, Pinky Crush, Vanilla Crush, and Candy Crush for all-day freshness and sun-kissed allure.',
    benefits: [
      'Long-wearing refreshing mist with delicate natural sweetness',
      'Infused with moisture-locking humectants for warm weather wear',
      'Handy 100ml spray flacon perfect for daily handbag carry',
      'Non-sticky, instant skin refreshment',
    ],
    ingredients:
      'Alcohol Denat., Aqua, Parfum, Glycerin, Propylene Glycol, Botanical Essential Oils.',
    howToUse:
      'Mist all over body, hair, and pulse points throughout the day for an immediate burst of tropical radiance.',
    skinTypes: ['All'],
    tags: ['Bestseller', 'Vegan'],
    variants: [
      { id: 'v1', name: 'Pistachio Crush (Fresh Nutty)', hexCode: '#9ACD32', stock: 20 },
      { id: 'v2', name: 'Pinky Crush (Sweet Rose)', hexCode: '#FFB6C1', stock: 15 },
      { id: 'v3', name: 'Vanilla Crush (Golden Amber)', hexCode: '#FFD700', stock: 18 },
      { id: 'v4', name: 'Candy Crush (Berry Violet)', hexCode: '#9370DB', stock: 12 },
    ],
    stock: 65,
    isFeatured: true,
  },
  {
    id: 'cc-03',
    slug: 'botanical-glow-facial-oil',
    name: 'Palmer’s Cocoa Butter Botanical Body Oil',
    subtitle: 'Moisturizes & Softens with Pure Vitamin E',
    category: 'body',
    price: 680.0,
    compareAtPrice: 850.0,
    rating: 5.0,
    reviewCount: 215,
    images: [
      '/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg',
      '/beautyImages/e2660f8d3d6e02246ae67904661af3e7.jpg',
    ],
    description:
      'Rich moisturizing body oil enriched with pure cocoa butter and vitamin E. Fast-absorbing formula that instantly softens rough, dry skin with a protective 48-hour moisture seal.',
    benefits: [
      '48-hour moisture lock dermatologist approved',
      'Non-greasy, fast absorption for tropical climates',
      'Ideal for bath, shower, or daily post-cleansing application',
      'Leaves a radiant healthy sheen across arms and legs',
    ],
    ingredients:
      'Glycine Soja (Soybean) Oil, Isopropyl Myristate, Theobroma Cacao (Cocoa) Extract, Tocopherol, Helianthus Annuus (Sunflower) Seed Oil, Fragrance.',
    howToUse:
      'Apply directly to damp skin after shower or bath. Gently smooth until absorbed for all-day luminous nourishment.',
    skinTypes: ['All', 'Dry', 'Normal', 'Combination'],
    tags: ['Clean', 'Award Winner'],
    stock: 35,
    isFeatured: true,
  },
  {
    id: 'cc-04',
    slug: 'solaris-eau-de-parfum',
    name: 'Touch Concentrated Pocket Perfume Edition',
    subtitle: 'Majestic Oud, Blue & Pink Concentrated Flacons',
    category: 'fragrance',
    price: 450.0,
    rating: 4.9,
    reviewCount: 88,
    images: [
      '/beautyImages/bd545c8751f20e872e51fc45f870cc99.jpg',
      '/beautyImages/77261bd99d7a546b2a2d90e473132e83.jpg',
    ],
    description:
      'Concentrated oil-rich pocket perfumes including Majestic Oud, Touch Pink, Touch Blue, and Green Editions. Long-lasting sillage formulated for tropical all-day endurance.',
    benefits: [
      'Pure concentrated perfume formulation with zero alcohol burn',
      'Enduring 16-hour projection on skin and fabrics',
      'Convenient travel-sized 5ml glass spray flacons',
      'Rich amber, floral, and woody oud olfactory signatures',
    ],
    ingredients:
      'Dipropylene Glycol, Fragrance (Parfum), Limonene, Linalool, Coumarin, Agarwood (Oud) Oil.',
    howToUse:
      'Spray 1-2 spritzes onto wrists, neck, and collarbones.',
    skinTypes: ['All'],
    tags: ['Bestseller', 'Limited Edition'],
    stock: 40,
    isFeatured: true,
  },
  {
    id: 'cc-05',
    slug: 'cloud-melt-cleansing-balm',
    name: 'Nivea Creme Soft & Care Shower Wash',
    subtitle: 'Almond Oil & Hydrating Vitamins Cleanser',
    category: 'skincare',
    price: 320.0,
    rating: 4.8,
    reviewCount: 164,
    images: [
      '/beautyImages/34452e2fc3a3d0262d96d96e2c62e95d.jpg',
    ],
    description:
      'Silky nourishing shower and facial wash enriched with natural almond oil and pro-vitamins. Cleanses deeply while preserving the natural skin barrier.',
    benefits: [
      'Mild pH-balanced cleansing formula suitable for sensitive skin',
      'Leaves skin noticeably softer and moisturized after every wash',
      'Free from microplastics and harsh sulfates',
      'Creamy lather that rinses effortlessly clean',
    ],
    ingredients:
      'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Glycerin, Glycol Distearate, Citric Acid, Parfum.',
    howToUse:
      'Apply to wet skin, massage into a gentle rich foam, then rinse thoroughly.',
    skinTypes: ['All', 'Sensitive', 'Dry', 'Combination', 'Oily'],
    tags: ['Bestseller', 'Clean'],
    stock: 50,
    isFeatured: false,
  },
  {
    id: 'cc-06',
    slug: 'luminous-silk-skin-tint',
    name: 'Sure & Nivea 72H Fresh Defense Sprays',
    subtitle: 'Anti-Perspirant MotionSense & Dry Impact',
    category: 'body',
    price: 280.0,
    rating: 4.7,
    reviewCount: 230,
    images: [
      '/beautyImages/ff5509b7b3d0bf627a13767df76f3662.jpg',
      '/beautyImages/77261bd99d7a546b2a2d90e473132e83.jpg',
    ],
    description:
      'High-performance 48H to 72H anti-perspirant body sprays with motion-activated freshness and zero alcohol. Engineered for long hours in the sun and daily activities.',
    benefits: [
      'Provides 72-hour dependable odor and sweat defense',
      'Anti-stain and invisible on black and white clothes',
      'Includes cooling Pearl Extract and Avocado Oil variants',
      'Instant dry feel upon application',
    ],
    ingredients:
      'Butane, Isobutane, Propane, Cyclomethicone, Aluminum Chlorohydrate, Persea Gratissima Oil, Parfum.',
    howToUse:
      'Shake can well, hold 15cm from underarms and spray evenly.',
    skinTypes: ['All', 'Normal', 'Dry', 'Combination'],
    tags: ['Bestseller', 'Clean'],
    variants: [
      { id: 'st1', name: 'Fresh Active (Men Blue)', stock: 30 },
      { id: 'st2', name: 'Pearl & Beauty (Soft Smooth)', stock: 25 },
      { id: 'st3', name: 'Dry Comfort 72H (Clean White)', stock: 22 },
      { id: 'st4', name: 'Cool Kick 48H (Icy Fresh)', stock: 19 },
    ],
    stock: 110,
    isFeatured: true,
  },
  {
    id: 'cc-07',
    slug: 'golden-hour-body-elixir',
    name: 'eos Shea Better 24H Vanilla Cashmere Body Lotion',
    subtitle: '7 Nourishing Oils & Sustainably Sourced Shea',
    category: 'body',
    price: 520.0,
    rating: 4.9,
    reviewCount: 142,
    images: [
      '/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg',
      '/beautyImages/e2660f8d3d6e02246ae67904661af3e7.jpg',
    ],
    description:
      'Decadent, lightweight body lotion offering 24-hour hydration with sweet vanilla cashmere notes. Crafted with 7 nourishing oils and butters for sensitive skin protection.',
    benefits: [
      'Clinically tested 24-hour moisture without feeling heavy',
      'Delightful whipped vanilla cream and warm musk scent',
      'Fast-absorbing texture that will not stain clothing',
      'Formulated with sustainably harvested wild-grown shea butter',
    ],
    ingredients:
      'Water/Eau, Glycine Soja Oil, Butyrospermum Parkii Butter, Cetyl Alcohol, Glyceryl Stearate SE, Stearic Acid, Fragrance/Parfum, Vanilla Planifolia Extract.',
    howToUse:
      'Smooth over entire body daily, concentrating on elbows, knees, and dry areas.',
    skinTypes: ['All'],
    tags: ['Bestseller', 'Vegan'],
    stock: 40,
    isFeatured: false,
  },
  {
    id: 'cc-08',
    slug: 'the-city-glow-discovery-ritual',
    name: 'The Sunyani Glow Discovery Vault',
    subtitle: 'Full Skincare, Body Lotion & Mist Collection',
    category: 'sets',
    price: 1200.0,
    compareAtPrice: 1650.0,
    rating: 5.0,
    reviewCount: 310,
    images: [
      '/beautyImages/cc.jpg',
      '/beautyImages/258826bc9ee800fab3177221c23668ef.jpg',
    ],
    description:
      'The comprehensive City Cosmetics Sunyani flagship suite. Includes the 72H Intensive Moisture Body Milk, Cocoa Butter Elixir, Lasgidi fine mists, and pocket perfumes in a presentation gift set.',
    benefits: [
      'Comprehensive 4-step ritual for maximum glass skin radiance',
      'Contains both daily facial care and all-day body fragrance',
      'Over 25% savings compared to purchasing each item separately',
      'Packed with genuine showroom packaging directly in Sunyani',
    ],
    ingredients:
      'Set includes: Intensive Moisture 72H Body Milk, Palmer’s Cocoa Butter Oil, Lasgidi Body Mist, Touch Pocket Perfume.',
    howToUse:
      'Cleanse with Creme Soft -> Apply 72H Moisture Body Milk -> Seal with Cocoa Butter Oil -> Spritz Touch Pocket Perfume.',
    skinTypes: ['All'],
    tags: ['Bestseller', 'Award Winner', 'Limited Edition'],
    stock: 25,
    isFeatured: true,
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'cc-01',
    author: 'Ama Osei-Bonsu',
    rating: 5,
    title: 'Instant glass skin in the heat of Sunyani',
    comment:
      'I live in Sunyani and humidity usually breaks down any lotion I try. This intensive moisture absorbs in seconds and keeps my skin glowing all day.',
    date: 'March 14, 2026',
    verified: true,
    skinType: 'Combination',
  },
  {
    id: 'rev-02',
    productId: 'cc-02',
    author: 'Akua Mensah',
    rating: 5,
    title: 'The Lasgidi mists smell heavenly',
    comment:
      'Bought the Vanilla and Pistachio Crush mists from the showroom on Commercial Avenue. The scent stays on my clothes from morning till evening!',
    date: 'February 28, 2026',
    verified: true,
    skinType: 'Normal',
  },
  {
    id: 'rev-03',
    productId: 'cc-03',
    author: 'Serwaa Appiah',
    rating: 5,
    title: 'Palmer’s Cocoa Butter is unmatched',
    comment:
      'The cocoa butter body oil gives the most beautiful golden glow to my legs. Prompt dispatch to Kumasi via VIP courier within 24 hours!',
    date: 'March 02, 2026',
    verified: true,
    skinType: 'Dry',
  },
  {
    id: 'rev-04',
    productId: 'cc-04',
    author: 'Kwame Boateng',
    rating: 5,
    title: 'Touch Majestic Oud is a masterpiece',
    comment:
      'The pocket perfume fits right in my pocket and projection is strong without being overpowering. Definitely my daily signature in Sunyani.',
    date: 'January 19, 2026',
    verified: true,
  },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'How does your skin typically feel by midday in the climate?',
    options: [
      { text: 'Tight, parched, or noticeably dry', skinType: 'Dry', category: 'skincare' },
      { text: 'Shiny or oily across forehead and nose', skinType: 'Combination', category: 'skincare' },
      { text: 'Prone to redness, stinging or irritation', skinType: 'Sensitive', category: 'skincare' },
      { text: 'Comfortable and balanced overall', skinType: 'Normal', category: 'skincare' },
    ],
  },
  {
    id: 2,
    question: 'What is your primary beauty and skin objective?',
    options: [
      { text: 'Deep hydration & glass-skin radiance', targetSlug: 'lumiere-hydra-dew-serum' },
      { text: 'Nourishing cocoa butter barrier restoration', targetSlug: 'botanical-glow-facial-oil' },
      { text: 'Refreshing daily mist & body fragrance', targetSlug: 'velvet-matte-silk-lipstick' },
      { text: 'A complete iconic transformation routine', targetSlug: 'the-city-glow-discovery-ritual' },
    ],
  },
  {
    id: 3,
    question: 'What finish do you prefer for your daily beauty ritual?',
    options: [
      { text: 'Luminous, dewy and natural sheer tint', targetSlug: 'lumiere-hydra-dew-serum' },
      { text: 'Sensorial fine fragrance mist', targetSlug: 'velvet-matte-silk-lipstick' },
      { text: 'Rich cocoa butter golden sheen', targetSlug: 'botanical-glow-facial-oil' },
      { text: 'Concentrated oud pocket perfume', targetSlug: 'solaris-eau-de-parfum' },
    ],
  },
];
