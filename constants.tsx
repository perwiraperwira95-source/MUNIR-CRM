
import { Category, Product, User, Role } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Admin Munir',
    email: 'admin@munir.com',
    password: 'admin123',
    role: Role.ADMIN,
    avatar: 'https://picsum.photos/id/64/100/100'
  },
  {
    id: '2',
    name: 'Siti Kasir',
    email: 'cashier@munir.com',
    password: 'kasir123',
    role: Role.CASHIER,
    avatar: 'https://picsum.photos/id/65/100/100'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    price: 25000,
    stock: 50,
    category: Category.MAKANAN,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Es Teh Manis',
    price: 5000,
    stock: 100,
    category: Category.MINUMAN,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Indomie Goreng Ayam',
    price: 15000,
    stock: 200,
    category: Category.MAKANAN,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Air Mineral 600ml',
    price: 4000,
    stock: 150,
    category: Category.MINUMAN,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Kripik Singkong Gurih',
    price: 12000,
    stock: 80,
    category: Category.SNACK,
    image: 'https://images.unsplash.com/photo-15994906592a3-e3f964200aa1?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Sabun Mandi Premium',
    price: 8500,
    stock: 40,
    category: Category.SEMBAKO,
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  }
];

export const TAX_RATE = 0.11; // 11% PPN
