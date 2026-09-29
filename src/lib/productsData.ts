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
      'Dispense 3-4 drops onto cleansed, slightly damp face and neck morning and evening. Gently press and pat with fingertips until fully absorbed before applying moisturizer.',
    skinTypes: ['All', 'Dry', 'Sensitive', 'Normal', 'Combination'],
    tags: ['Bestseller', 'Clean', 'Award Winner'],
    stock: 45,
    isFeatured: true,
  },
  {
    id: 'cc-02',
    slug: 'velvet-silk-matte-lipstick',
    name: 'Velvet Silk Cushion Lipstick',
    subtitle: 'Weightless Pigment with Hyaluronic Hydration',
    category: 'makeup',
    price: 450.0,
    compareAtPrice: 520.0,
    rating: 4.8,
    reviewCount: 218,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'A cushiony, non-drying matte lipstick that wraps lips in rich, vibrant color. Infused with cold-pressed marula oil and microspheres of hyaluronic acid to ensure all-day comfort without feathering.',
    benefits: [
      'True velvet matte finish with feather-light wear',
      'Up to 10 hours of rich, fade-proof pigmentation',
      'Conditioning oils prevent cracking and dryness',
      'Refillable gold-embossed architectural case',
    ],
    ingredients:
      'Dimethicone, Polyglyceryl-2 Triisostearate, Sclerocarya Birrea (Marula) Seed Oil, Hyaluronic Acid Spheres, Tocopherol (Vitamin E), Synthetic Wax, Silica, Iron Oxides, Red 7 Lake.',
    howToUse:
      'Glide directly across bare lips from center outwards for rich opaque coverage, or blot lightly with fingertips for a romantic blurred stain.',
    skinTypes: ['All'],
    tags: ['Bestseller', 'Vegan'],
    variants: [
      { id: 'v1', name: 'Nude City (Warm Almond)', hexCode: '#C88A75', stock: 24 },
      { id: 'v2', name: 'Rouge Manhattan (Classic Crimson)', hexCode: '#A3192F', stock: 18 },
      { id: 'v3', name: 'SoHo Sunset (Terracotta Coral)', hexCode: '#D96B43', stock: 15 },
      { id: 'v4', name: 'Petal Plaza (Soft Dusty Mauve)', hexCode: '#B87D8E', stock: 20 },
      { id: 'v5', name: 'Midnight Berry (Deep Bordeaux)', hexCode: '#5B1E31', stock: 12 },
    ],
    stock: 89,
    isFeatured: true,
  },
  {
    id: 'cc-03',
    slug: 'botanical-radiance-glow-oil',
    name: 'Botanical Radiance Glow Oil',
    subtitle: 'Cold-Pressed 12-Seed Antioxidant Face Oil',
    category: 'skincare',
    price: 950.0,
    compareAtPrice: 1150.0,
    rating: 4.9,
    reviewCount: 189,
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'A golden lipid restorative crafted from 12 cold-pressed botanical seed oils including Rosehip, Kalahari Melon, Jojoba, and Squalane. Restores firmness and locks in luminosity with a dry-touch finish.',
    benefits: [
      'Restores essential fatty acids and cellular lipid matrix',
      'Leaves a silky, glass-finish sheen with zero greasy residue',
      'Defends against oxidative stress and photo-aging',
      'Infused with French neroli & golden jojoba',
    ],
    ingredients:
      'Simmondsia Chinensis (Jojoba) Seed Oil, Rosa Canina (Rosehip) Seed Oil, Citrullus Lanatus (Kalahari Melon) Seed Oil, Plant Squalane, Tocopheryl Acetate, Citrus Aurantium Dulcis (Neroli) Flower Oil, Bisabolol.',
    howToUse:
      'Warm 2-3 drops between palms and gently press onto face, neck, and décolleté as the final step of your nighttime ritual or mix a drop into your foundation for supreme dewiness.',
    skinTypes: ['All', 'Dry', 'Normal', 'Combination'],
    tags: ['Clean', 'Award Winner', 'Vegan'],
    stock: 32,
    isFeatured: true,
  },
  {
    id: 'cc-04',
    slug: 'urban-flora-eau-de-parfum',
    name: 'Urban Flora Eau de Parfum',
    subtitle: 'Bergamot, Night Jasmine & Cashmere Woods',
    category: 'fragrance',
    price: 1400.0,
    compareAtPrice: 1600.0,
    rating: 5.0,
    reviewCount: 97,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'An intoxicating fragrance inspired by moonlit tropical gardens. Opens with crisp bergamot and pink peppercorn, unfolding into a seductive heart of blooming jasmine and settling onto a base of warm cashmere amber.',
    benefits: [
      'High fragrance concentration (22% Eau de Parfum) with 12+ hour longevity',
      'Crafted with ethically harvested West African florals and botanicals',
      'Clean formulation free of parabens, phthalates, and synthetic dyes',
      'Presented in a weighted, hand-polished crystal flacon',
    ],
    ingredients:
      'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Benzyl Salicylate, Hydroxycitronellal, Coumarin, Citronellol.',
    howToUse:
      'Spray on pulse points: wrists, collarbone, behind ears, and at the nape of the neck. Avoid rubbing wrists together to preserve delicate fragrance notes.',
    skinTypes: ['All'],
    tags: ['New', 'Award Winner', 'Limited Edition'],
    stock: 28,
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
    author: 'Genevieve V.',
    rating: 5,
    date: '2 days ago',
    title: 'Holy grail for dull city skin!',
    comment:
      'I live in NYC and the pollution combined with air conditioning always dried out my skin. Since using the Lumière Hydra-Dew Serum, my face stays plump and glowing all day long. Makeup sits on top like a dream.',
    verified: true,
    skinType: 'Combination / Sensitive',
  },
  {
    id: 'rev-02',
    productId: 'cc-02',
    author: 'Chloe M.',
    rating: 5,
    date: '1 week ago',
    title: 'The best velvet texture I have ever tried',
    comment:
      'Normally matte lipsticks dry out my lips, but Nude City is pure magic. It feels like silk and lasts through my entire work dinner without smudging.',
    verified: true,
    skinType: 'Normal',
  },
  {
    id: 'rev-03',
    productId: 'cc-03',
    author: 'Sarah K.',
    rating: 5,
    date: '2 weeks ago',
    title: 'Liquid gold in a bottle',
    comment:
      'Non-greasy, smells heavenly, and gives the most incredible dewy glow. I mix one drop into my morning foundation and everyone asks what skincare I use!',
    verified: true,
    skinType: 'Dry',
  },
  {
    id: 'rev-04',
    productId: 'cc-04',
    author: 'Elena R.',
    rating: 5,
    date: '3 weeks ago',
    title: 'Sophisticated & enchanting',
    comment:
      'Urban Flora is my new signature scent. It manages to feel both vibrant and warmly intimate. Received compliments from strangers on the subway twice in one week!',
    verified: true,
    skinType: 'All',
  },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'How does your skin typically feel by midday?',
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
      { text: 'Nourishing barrier restoration & firming', targetSlug: 'botanical-radiance-glow-oil' },
      { text: 'Effortless complexion with daily SPF protection', targetSlug: 'luminous-silk-skin-tint' },
      { text: 'A complete iconic transformation routine', targetSlug: 'the-city-glow-discovery-ritual' },
    ],
  },
  {
    id: 3,
    question: 'What finish do you prefer for your daily makeup?',
    options: [
      { text: 'Luminous, dewy and natural sheer tint', targetSlug: 'luminous-silk-skin-tint' },
      { text: 'Velvety, sophisticated matte lips', targetSlug: 'velvet-silk-matte-lipstick' },
      { text: 'Bronzed, sun-drenched body glow', targetSlug: 'golden-hour-body-elixir' },
      { text: 'Enchanting floral fragrance touch', targetSlug: 'urban-flora-eau-de-parfum' },
    ],
  },
];
