
export enum Role {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER'
}

export enum Category {
  MAKANAN = 'Makanan',
  MINUMAN = 'Minuman',
  SNACK = 'Snack',
  SEMBAKO = 'Sembako',
  ELEKTRONIK = 'Elektronik',
  FASHION = 'Fashion'
}

export enum PaymentMethod {
  CASH = 'Tunai',
  COD = 'COD',
  EWALLET_DANA = 'DANA',
  EWALLET_OVO = 'OVO',
  EWALLET_GOPAY = 'GOPAY',
  EWALLET_SHOPEEPAY = 'ShopeePay',
  TRANSFER = 'Transfer Bank',
  QRIS = 'QRIS'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  points: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  createdAt: string;
}

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  type: 'fixed' | 'percent';
  description: string;
  expiry: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: Category;
  image: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashierName: string;
  customerId?: string;
  customerName?: string;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  storeLogo: string;
  whatsappNumber: string;
  taxRate: number;
}
