import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  image: string;
  images: string[];
  category: string;
  brand?: string | null;
  stock: number;
  sku?: string | null;
  tags: string[];
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  notes?: string | null;
  createdAt: Date;
  items: OrderItem[];
  user?: { name: string; email: string };
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: { name: string; image: string };
}

export interface Message {
  id: string;
  roomId: string;
  content: string;
  senderRole: string;
  senderName: string;
  read: boolean;
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  userId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: { name: string; email: string };
  messages: Message[];
}
