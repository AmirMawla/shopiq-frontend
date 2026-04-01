import {Product} from './product';


export interface CartItemModel {
    _id?: string;
    //productId: string;
    productId:Product;
    quantity: number;
    priceAtAddTime: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CartModel {
  _id?: string;
  id?: string;
  userId?: string;
  sessionId?: string;
  items: CartItemModel[];
  promoCode?: string;
  discountAmount: number;
  subtotal:number;
  total: number; 
  itemCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecieptModel{
  discount:number,
  finalTotal:number,
  itemCount:number
}

