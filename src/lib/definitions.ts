import { type User as FirebaseUser } from 'firebase/auth';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageId: string;
  customization: string[];
};

export type Category =
  | 'Haldi Platters'
  | 'Mehndi Platters'
  | 'Engagement Accessories'
  | 'Hampers'
  | 'Nikah Pens'
  | 'Ring Platters'
  | 'Decor'
  | 'Return Gifts';

export type CartItem = {
  product: Product;
  quantity: number;
};

export type WishlistItem = {
  productId: string;
  addedAt: Date;
};

export type User = FirebaseUser;
