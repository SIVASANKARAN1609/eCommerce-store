import { useState, useEffect, useCallback } from 'react';
import { Product, products } from '../data/products';

export interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
}

export interface PopulatedCartItem extends CartItem {
  product: Product;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('shopvibe_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopvibe_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((productId: string, quantity: number = 1, color?: string) => {
    setCart(prev => {
      const existingItemIndex = prev.findIndex(item => item.productId === productId && item.color === color);
      
      if (existingItemIndex >= 0) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prev, { productId, quantity, color }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string, color?: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.color === color)));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    
    setCart(prev => prev.map(item => 
      (item.productId === productId && item.color === color) 
        ? { ...item, quantity } 
        : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const populatedCart: PopulatedCartItem[] = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product: product! };
  }).filter(item => item.product !== undefined);

  const subtotal = populatedCart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart: populatedCart,
    rawCart: cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount
  };
}