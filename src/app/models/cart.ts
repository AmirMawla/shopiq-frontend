import {Product} from './product';

export interface CartItemModel {
    _id?: string;
    product: Product;
    quantity: number;
}

export interface CartModel {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: CartItemModel[];
  promoCode?: string;
  discountAmount: number;
  total: number; 
  itemCount: number;
  createdAt?: string;
  updatedAt?: string;
}