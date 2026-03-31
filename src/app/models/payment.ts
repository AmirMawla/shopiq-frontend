export type PaymentMethod = 'credit_card' | 'paypal' | 'cash_on_delivery' | 'wallet';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export interface Payment {
  _id?: string;
  orderId: string;
  totalAmount: number;
  date?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string | null;
  refundedAmount?: number;
  refundedAt?: string | null;
  refundReason?: string | null;
  paidBy?: {
    userId?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
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

export interface TransactionsCountResponse {
  count: number;
}

export interface PaymentStatsResponse {
  totalTransactions: number;
  completedTransactions: number;
  pendingTransactions: number;
  totalRevenue: number;
}

export interface RevenueByPaymentMethodRow {
  paymentMethod: PaymentMethod | string;
  revenue: number;
}

export interface TransactionRow {
  id: string;
  totalAmount: number;
  transactionDate: string;
  status: PaymentStatus | string;
  paymentMethod: PaymentMethod | string;
  orderId: string;
  customerName: string;
}

export interface VendorTransactionRow {
  orderId: string;
  customerName: string;
  customerEmail?: string | null;
  vendorAmount: number;
  paymentMethod: PaymentMethod | string;
  status: PaymentStatus | string;
  transactionDate: string;
  products: Array<{
    productId: string;
    nameEn: string;
    nameAr: string;
    price: number;
    quantity: number;
  }>;
}

export interface TransactionListQuery {
  page?: number;
  limit?: number;
  sortBy?: 'transactionDate' | 'totalAmount' | 'paymentStatus' | 'paymentMethod' | 'orderId' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  statuses?: string[] | string;
  date?: string;
  search?: string;
  paymentMethods?: string[] | string;
}

export interface VendorTransactionsQuery extends TransactionListQuery {
  vendorId?: string;
}

export interface UserTransactionsQuery extends TransactionListQuery {
  userId?: string;
}

