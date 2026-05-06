import { useState, useEffect, useCallback } from 'react';
import { products } from '../data/products';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('shopvibe_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopvibe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, []);

  const isLiked = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return {
    wishlist,
    wishlistProducts,
    toggleWishlist,
    isLiked
  };
}