export interface ProductVariant {
  id: string;
  name: string;
  hexCode?: string;
  priceOverride?: number;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface BeautyImage {
  id: string;
  image: string;
  tag: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
  skinTypes: ('All' | 'Dry' | 'Oily' | 'Combination' | 'Sensitive' | 'Normal')[];
  tags: ('Bestseller' | 'New' | 'Clean' | 'Award Winner' | 'Vegan' | 'Limited Edition' | string)[];
  variants?: ProductVariant[];
  stock: number;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  skinType?: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
    variantName?: string;
  }[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending';
  paymentMethod?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
  savedAddresses?: Array<{
    id: string;
    street: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
  }>;
}
