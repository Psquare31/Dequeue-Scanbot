export interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
  image_url?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export type ScannerStatus = 'inactive' | 'scanning' | 'success' | 'error';