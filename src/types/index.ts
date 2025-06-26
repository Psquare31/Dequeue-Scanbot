export interface Product {
  id: string;
  _id: string;
  name: string;
  price: number;
  discount?: number;
  barcode: string;
  image_url?: string;
  description?: string;
  category: string;
  tags?: string[];
  rating?: number;
  totalPurchases?: number;
  similarProducts?: string[]; // Array of product _ids
}

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}


export interface Party {
  company: string;
  //address: string;
  //zip: string;
  //city: string;
  country: string;
}

export interface ProductInvoice {
  quantity: string;
  description: string;
  tax: number;
  price: number;
}

export interface InvoiceProps {
  sender: Party;
  email: string;
  client: Party;
  products: ProductInvoice[];
  invoiceNumber: string;
  invoiceDate: string;
}

export interface SendInvoiceProps {
  orderId: string;
  amount: number;
  email: string;
  products: ProductInvoice[];
}


export interface RazorpayOrderResponse {
  success: boolean;
  data: {
    id: string;
    amount: number;
    currency: string;
  };
}

export interface RazorpayOrderData {
  id: string;
  amount: number;
  currency: string;
}

export interface RazorpayVerifyResponse {
  success: boolean;
  message: string;
}

export interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CartItem extends Product {
  quantity: number;
  review?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export type ScannerStatus = 'inactive' | 'scanning' | 'success' | 'error';