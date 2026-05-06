import { useState, useEffect, useCallback } from 'react';
import { CartItem } from './useCart';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: number; // 0: Placed, 1: Packed, 2: Shipped, 3: Out for Delivery, 4: Delivered
}

const DUMMY_ORDERS: Order[] = [
  {
    id: 'ORD-000001',
    items: [
      { productId: 'elec-1', quantity: 1, color: '#000000' },
      { productId: 'elec-3', quantity: 2, color: '#FFFFFF' },
    ],
    total: 1048.97,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 3,
  },
  {
    id: 'ORD-000002',
    items: [
      { productId: 'fash-2', quantity: 1, color: '#FF6B6B' },
      { productId: 'fash-3', quantity: 1, color: '#4ECDC4' },
    ],
    total: 219.98,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: 4,
  },
  {
    id: 'ORD-000003',
    items: [
      { productId: 'home-1', quantity: 1, color: '#F5F5DC' },
    ],
    total: 89.99,
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 0,
  },
];

function getInitialOrders(): Order[] {
  const saved = localStorage.getItem('shopvibe_orders');
  if (saved) {
    const parsed: Order[] = JSON.parse(saved);
    if (parsed.length > 0) return parsed;
  }
  localStorage.setItem('shopvibe_orders', JSON.stringify(DUMMY_ORDERS));
  return DUMMY_ORDERS;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(getInitialOrders);

  useEffect(() => {
    localStorage.setItem('shopvibe_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = useCallback((items: CartItem[], total: number) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      items,
      total,
      date: new Date().toISOString(),
      status: 0,
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        if (order.status <= 0) return order;
        return { ...order, status: order.status - 1 };
      })
    );
  }, []);

  const removeOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  return {
    orders,
    placeOrder,
    cancelOrder,
    removeOrder,
  };
}
