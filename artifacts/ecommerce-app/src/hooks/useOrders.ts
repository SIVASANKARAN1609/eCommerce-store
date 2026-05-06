import { useState, useEffect, useCallback } from 'react';
import { CartItem } from './useCart';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: number; // 0: Placed, 1: Packed, 2: Shipped, 3: Out for Delivery, 4: Delivered
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shopvibe_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopvibe_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = useCallback((items: CartItem[], total: number) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      items,
      total,
      date: new Date().toISOString(),
      status: 0
    };
    
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  return {
    orders,
    placeOrder
  };
}