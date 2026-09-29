import { Product, Review } from '@/types';

export const CURRENCY_SYMBOL = 'GH₵';

export const CATEGORIES = [
  {
    id: 'skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Potent botanicals and clinical actives crafted in Sunyani for an effortless glass-skin glow.',
    image: 'https://images.unsplash.com/photo-1608248597359-216694663806?auto=format&fit=crop&w=800&q=80',
    itemCount: 12,
  },
  {
    id: 'makeup',
    name: 'Makeup & Complexion',
    slug: 'makeup',
    description: 'Weightless formulas designed to enhance your natural beauty.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    itemCount: 16,
  },
  {
    id: 'fragrance',
    name: 'Fine Fragrance',
    slug: 'fragrance',
    description: 'Sensory perfumes blending West African florals and modern tropical woods.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    itemCount: 8,
  },
  {
    id: 'body',
    name: 'Bath & Body',
    slug: 'body',
    description: 'Silken body elixirs and scrubs infused with antioxidant oils.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    itemCount: 9,
  },
  {
    id: 'sets',
    name: 'Curated Sets & Gifts',
    slug: 'sets',
    description: 'Award-winning discovery routines and exclusive seasonal bundles.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
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
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1608248597359-216694663806?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=85',
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
    name: 'Velvet Silk Lip Colour',
    subtitle: 'Weightless Cashmere Sensation with Camellia Oil',
    category: 'makeup',
    price: 380.0,
    rating: 4.8,
    reviewCount: 198,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'An elevated, sensorial lipstick delivering couture-level matte pigment without dryness. Enriched with cold-pressed camellia seed oil and antioxidant vitamin E for all-day supple lips.',
    benefits: [
      '12-hour comfortable velvet-matte wear with zero flaking',
      'One-swipe full coverage pigment concentration',
      'Infused with rare Ghanaian shea and camellia oleifera oils',
      'Magnetic weighted luxury flacon with refillable bullet',
    ],
    ingredients:
      'Dimethicone, Polyglyceryl-2 Triisostearate, Synthetic Wax, Camellia Japonica Seed Oil, Butyrospermum Parkii (Shea) Butter, Silica, Tocopherol, CI 77491, CI 15850.',
    howToUse:
      'Glide directly across lips from the center outwards. For an editorial blurred effect, tap gently with ring fingertip.',
    skinTypes: ['All'],
    tags: ['Bestseller', 'Vegan'],
    variants: [
      { id: 'v1', name: 'Nude City (Warm Rose)', hexCode: '#B57C74', stock: 20 },
      { id: 'v2', name: 'Sunyani Sunset (Rich Terracotta)', hexCode: '#C15C3D', stock: 15 },
      { id: 'v3', name: 'Accra Midnight (Deep Plum)', hexCode: '#692837', stock: 18 },
      { id: 'v4', name: 'Bono Berry (Vibrant Crimson)', hexCode: '#9E1B32', stock: 12 },
    ],
    stock: 65,
    isFeatured: true,
  },
  {
    id: 'cc-03',
    slug: 'botanical-glow-facial-oil',
    name: 'Botanical Radiance Glow Oil',
    subtitle: '12 Cold-Pressed Active Plant Seed Elixir',
    category: 'skincare',
    price: 920.0,
    compareAtPrice: 1100.0,
    rating: 5.0,
    reviewCount: 215,
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'A golden liquid treasure blending Baobab, Marula, Rosehip, and Kalahari Melon seed oils. Absorbs rapidly without pore congestion, locking in vital nourishment and providing antioxidant armor.',
    benefits: [
      'Recharges tired skin barrier with essential Omega 3, 6 & 9',
      'Silky dry oil texture that leaves a dewy non-greasy satin finish',
      'Sustainably sourced botanical harvests from West Africa',
      'Naturally scented with wild frankincense and damask rose',
    ],
    ingredients:
      'Adansonia Digitata (Baobab) Seed Oil, Sclerocarya Birrea (Marula) Kernel Oil, Rosa Canina (Rosehip) Fruit Oil, Citrullus Lanatus (Watermelon) Seed Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Boswellia Carterii Oil, Rosa Damascena Flower Oil.',
    howToUse:
      'Warm 2-3 drops between palms and gently press onto face, neck, and décolleté as the final step of your nighttime ritual or mix a drop into your foundation for supreme dewiness.',
    skinTypes: ['All', 'Dry', 'Normal', 'Combination'],
    tags: ['Clean', 'Award Winner'],
    stock: 35,
    isFeatured: true,
  },
  {
    id: 'cc-04',
    slug: 'solaris-eau-de-parfum',
    name: 'Solaris Eau de Parfum',
    subtitle: 'Golden Amber, Bergamot & West African White Cedar',
    category: 'fragrance',
    price: 1450.0,
    rating: 4.9,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'A magnetic sensory signature evoking the golden hour over Sunyani. Opens with sunlit calabrian bergamot and pink pepper, evolves into heart notes of orange blossom and jasmine sambac, grounded by a hypnotic base of golden amber, warm vanilla bean, and cedarwood.',
    benefits: [
      'Extrait de parfum concentration with 24% fragrance oils',
      'Over 14 hours of enduring sensual sillage',
      'Hand-poured into architectural heavy-base flacons',
      'Gender-neutral and universally alluring',
    ],
    ingredients:
      'Alcohol Denat., Fragrance (Parfum), Water/Aqua, Benzyl Salicylate, Limonene, Linalool, Coumarin, Citronellol, Geraniol.',
    howToUse:
      'Mist onto pulse points: collarbones, wrists, behind the earlobes, and the nape of the neck. Do not rub wrists together.',
    skinTypes: ['All'],
    tags: ['Bestseller', 'Limited Edition'],
    stock: 20,
    isFeatured: true,
  },
  {
    id: 'cc-05',
    slug: 'cloud-melt-cleansing-balm',
    name: 'Cloud-Melt Cleansing Balm',
    subtitle: 'Nourishing Chamomile & Oat Melting Cleanser',
    category: 'skincare',
    price: 550.0,
    rating: 4.8,
    reviewCount: 164,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1608248597359-216694663806?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'A decadent sorbet-textured balm that instantly transforms into a silky oil, dissolving waterproof makeup, SPF, and urban impurities without stripping delicate moisture.',
    benefits: [
      'Effortlessly melts away long-wear eye makeup and sunscreen',
      'Rinses completely clean without leaving a cloudy film or residue',
      'Calms sensitive skin with colloidal oat and blue chamomile',
      'Includes a dual-sided organic bamboo cleansing cloth',
    ],
    ingredients:
      'Caprylic/Capric Triglyceride, Helianthus Annuus (Sunflower) Seed Oil, PEG-20 Glyceryl Triisostearate, Cera Alba, Avena Sativa (Colloidal Oat) Kernel Flour, Chamomilla Recutita (Matricaria) Flower Oil, Tocopherol.',
    howToUse:
      'Massage a scoop onto dry skin in circular motions. Add warm water to emulsify into a milky cleanser, then rinse clean or wipe with warm damp cloth.',
    skinTypes: ['All', 'Sensitive', 'Dry', 'Combination', 'Oily'],
    tags: ['Bestseller', 'Clean'],
    stock: 50,
    isFeatured: false,
  },
  {
    id: 'cc-06',
    slug: 'luminous-silk-skin-tint',
    name: 'Luminous Silk Skin Tint SPF 30',
    subtitle: 'Breathable Sheer-to-Medium Buildable Complexion',
    category: 'makeup',
    price: 620.0,
    rating: 4.7,
    reviewCount: 230,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'A featherweight skin tint that evens skin tone while giving a natural luminous second-skin glow. Packed with non-nano zinc mineral SPF 30 and hydrating peptides.',
    benefits: [
      'Provides broad-spectrum UVA/UVB SPF 30 mineral protection',
      'Evens redness and blemishes with breathable satin coverage',
      'Infused with copper peptides for all-day skin barrier support',
      'Sweat-resistant and non-comedogenic',
    ],
    ingredients:
      'Zinc Oxide (12%), Water, Isododecane, Squalane, Niacinamide, Copper Tripeptide-1, Glycerin, Polyglyceryl-4 Diisostearate, Iron Oxides.',
    howToUse:
      'Shake well before use. Apply 2-3 pumps using fingers or a damp beauty sponge, starting from the center of face and blending outward.',
    skinTypes: ['All', 'Normal', 'Dry', 'Combination'],
    tags: ['Bestseller', 'Clean', 'Vegan'],
    variants: [
      { id: 'st1', name: 'Fair 01 (Cool Neutral)', hexCode: '#F6E4D9', stock: 30 },
      { id: 'st2', name: 'Light 02 (Golden Warm)', hexCode: '#EED3C2', stock: 25 },
      { id: 'st3', name: 'Medium 03 (Warm Honey)', hexCode: '#DCB193', stock: 22 },
      { id: 'st4', name: 'Tan 04 (Caramel Olive)', hexCode: '#BA8965', stock: 19 },
      { id: 'st5', name: 'Deep 05 (Rich Espresso)', hexCode: '#6F4735', stock: 14 },
    ],
    stock: 110,
    isFeatured: true,
  },
  {
    id: 'cc-07',
    slug: 'golden-hour-body-elixir',
    name: 'Golden Hour Shimmer Body Elixir',
    subtitle: 'Nourishing Macadamia & Golden Mica Glow Oil',
    category: 'body',
    price: 680.0,
    rating: 4.9,
    reviewCount: 142,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'A decadent dry body oil loaded with ultra-fine mineral golden micas that illuminate legs, arms, and collarbones with sun-kissed perfection, scented with tropical vanilla orchid.',
    benefits: [
      'Gives skin a luxurious, reflective bronzed glow',
      'Fast-absorbing dry oil that will not transfer to clothes',
      'Nourishes with Macadamia and Sweet Almond oils',
      'Delicate, warm sunlit scent of vanilla orchid and sea salt',
    ],
    ingredients:
      'Caprylic/Capric Triglyceride, Macadamia Ternifolia Seed Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Mica, Silica, Titanium Dioxide, Vanilla Planifolia Fruit Extract, Fragrance.',
    howToUse:
      'Shake vigorously to suspend shimmer particles. Smooth generously over arms, shoulders, collarbones, and legs for an instant luminous finish.',
    skinTypes: ['All'],
    tags: ['Bestseller', 'Vegan'],
    stock: 40,
    isFeatured: false,
  },
  {
    id: 'cc-08',
    slug: 'the-city-glow-discovery-ritual',
    name: 'The City Glow Discovery Ritual Set',
    subtitle: '4-Piece Iconic Skincare & Complexion Minis',
    category: 'sets',
    price: 1200.0,
    compareAtPrice: 1750.0,
    rating: 5.0,
    reviewCount: 310,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'The definitive introduction to City Cosmetics. Features deluxe travel sizes of our #1 Lumière Hydra-Dew Serum, Cloud-Melt Cleanser, Botanical Glow Oil, and Velvet Silk Lipstick in Nude City, nestled in a vegan leather travel pouch.',
    benefits: [
      'Comprehensive 4-step ritual for maximum glass skin radiance',
      'TSA-approved sizes perfect for travel or discovery',
      'Over 30% savings compared to purchasing full sizes separately',
      'Presented in a bespoke blush structured vanity case',
    ],
    ingredients:
      'Set includes: Lumière Hydra-Dew Serum (15ml), Cloud-Melt Cleansing Balm (30g), Botanical Glow Oil (15ml), Velvet Silk Lipstick (Full Size Nude City).',
    howToUse:
      'Follow steps 1 to 4: Cleanse with Cloud-Melt -> Hydrate with Hydra-Dew -> Seal with Glow Oil -> Finish with Velvet Silk Lipstick.',
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
      'I live in Sunyani and humidity usually breaks down any serum I try. Lumière Hydra-Dew absorbs in seconds and keeps my skin plump and glowy throughout the day. A staple for my vanity.',
    date: 'March 14, 2026',
    verified: true,
    skinType: 'Combination',
  },
  {
    id: 'rev-02',
    productId: 'cc-02',
    author: 'Akua Mensah',
    rating: 5,
    title: 'The shade Nude City is perfection',
    comment:
      'Finally, a nude lipstick with warm undertones that does not wash out melanin skin. Wore it to a wedding in Accra and it stayed put from morning photos through dancing.',
    date: 'February 28, 2026',
    verified: true,
    skinType: 'Normal',
  },
  {
    id: 'rev-03',
    productId: 'cc-03',
    author: 'Serwaa Appiah',
    rating: 5,
    title: 'Holy grail for dull, tired skin',
    comment:
      'The Botanical Glow Oil is pure liquid silk. I mix two drops into my foundation every morning and my skin looks lit from within. Customer service from Sunyani was also exceptionally fast on WhatsApp!',
    date: 'March 02, 2026',
    verified: true,
    skinType: 'Dry',
  },
  {
    id: 'rev-04',
    productId: 'cc-04',
    author: 'Kwame Boateng',
    rating: 5,
    title: 'Complex, sophisticated, captivating',
    comment:
      'Solaris has become my daily signature. People constantly stop me in Kumasi to ask what fragrance I am wearing. Warm amber with just enough crisp citrus.',
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
      { text: 'Nourishing barrier restoration & firming', targetSlug: 'botanical-glow-facial-oil' },
      { text: 'Effortless complexion with daily SPF protection', targetSlug: 'luminous-silk-skin-tint' },
      { text: 'A complete iconic transformation routine', targetSlug: 'the-city-glow-discovery-ritual' },
    ],
  },
  {
    id: 3,
    question: 'What finish do you prefer for your daily beauty ritual?',
    options: [
      { text: 'Luminous, dewy and natural sheer tint', targetSlug: 'luminous-silk-skin-tint' },
      { text: 'Velvety, sophisticated matte lips', targetSlug: 'velvet-matte-silk-lipstick' },
      { text: 'Bronzed, sun-drenched body glow', targetSlug: 'golden-hour-body-elixir' },
      { text: 'Sensory West African amber fragrance', targetSlug: 'solaris-eau-de-parfum' },
    ],
  },
];

