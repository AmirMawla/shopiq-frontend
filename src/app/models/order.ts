export type OrderStatus =
  | 'notpayed'
  | 'pending'
  | 'proccessing'
  | 'shipped'
  | 'delivered'
  | 'canceled'
  | 'refunded';

export type ShippingStatus =
  | 'preparing'
  | 'outfordelivery'
  | 'delivered'
  | 'canceled'
  | 'returned';

export interface OrderItem {
  _id?: string;
  productId: string;
  productName: string;
  productImage?: string | null;
  priceAtOrder: number;
  quantity: number;
  vendorId?: string | null;
  lineTotal?: number;
}

export interface OrderPaymentSummary {
  totalAmount: number;
  status: string;
  date?: string;
  paymentMethod?: string;
}

export interface VendorOrderItemSummary {
  productId: string;
  productName: string;
  productImage?: string | null;
  price: number;
  quantity: number;
  lineTotal?: number;
  status?: ShippingStatus | string;
}

export interface OrderVendorSummary {
  vendorId: string | null;
  vendorName: string;
  totalAmount: number;
  totalQuantity: number;
  items: VendorOrderItemSummary[];
  vendorProfilePicture?: string | null;
}

export interface OrderDetailsVendorSummary {
  vendorId: string | null;
  vendorName: string;
  vendorPhone?: string | null;
  vendorProfilePicture?: string | null;
  vendorSubtotal: number;
  totalQuantity: number;
  items: VendorOrderItemSummary[];
  estimatedDeliveryDate?: string | null;
  shippingStatus?: ShippingStatus | string | null;
}

export interface OrderByIdResponse {
  id: string;
  userId: string;
  customerName?: string;
  subtotal?: number | null;
  discountAmount?: number;
  shippingFee?: number;
  promoCode?: string | null;
  totalAmount: number;
  orderDate: string;
  status: OrderStatus | string;
  items: OrderItem[];
  vendors: OrderVendorSummary[];
  payment?: OrderPaymentSummary | null;
}

export interface OrderDetailsResponse {
  id: string;
  subtotal?: number | null;
  discountAmount?: number;
  shippingFee?: number;
  promoCode?: string | null;
  totalAmount: number;
  orderDate: string;
  status: OrderStatus | string;
  vendors: OrderDetailsVendorSummary[];
}

export interface SpecificVendorOrderResponse {
  vendorOrder: {
    orderId: string;
    vendorId: string;
    vendorName: string;
    vendorProfilePicture?: string | null;
    status: OrderStatus | string;
    orderDate: string;
    totalQuantity: number;
    vendorSubtotal: number;
    subtotal?: number | null;
    discountAmount?: number;
    shippingFee?: number;
    promoCode?: string | null;
    totalAmount: number;
  };
  products: Array<{
    productId: string;
    productImage?: string | null;
    productName: string;
    price: number;
    quantity: number;
    isReviewed: boolean;
    rating: number;
  }>;
  customerAddress?: any;
  vendorPhone?: string | null;
  estimatedDeliveryDate?: string | null;
  shippingStatus?: ShippingStatus | string | null;
}

export interface PagedMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PagedResult<T> {
  items: T[];
  meta: PagedMeta;
}

export interface OrdersQuery {
  page?: number;
  limit?: number;
  sortBy?: 'orderDate' | 'totalAmount' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  statuses?: string[] | string;
  date?: string;
  search?: string;
  userId?: string;
  vendorId?: string;
}

export interface CreateOrderRequest {
  notes?: string | null;
}

export interface UpdateShipmentStatusRequest {
  newStatus: ShippingStatus;
  note?: string | null;
  location?: string | null;
}

export interface PaymentSession {
  sessionId: string;
  orderId: string;
  amount: number;
  sessionUrl?: string;
}

export interface CreateOrderResponse {
  order: OrderByIdResponse;
  paymentSession: PaymentSession;
}

export interface VendorRecentOrder {
  id: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus | string;
  customerName: string;
  items: Array<{ productName: string; quantity: number; price: number }>;
}

export interface CheckoutPreviewItem {
  vendorId: string | null;
  vendorName: string;
  productId: string;
  productName: string;
  productImage?: string | null;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface CheckoutPreviewResponse {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  promoCode: string | null;
  totalAmount: number;
  itemCount: number;
  items: CheckoutPreviewItem[];
}

