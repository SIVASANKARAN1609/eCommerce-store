import { useState, useEffect } from 'react';
import { Product, products } from '../data/products';

export function useProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  
  // Filter products based on search, category, and price
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory ? product.categorySlug === selectedCategory : true;
    
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const trendingProducts = products.filter(p => p.isTrending);
  const newProducts = products.filter(p => p.isNew);
  const specialOffers = products.filter(p => p.originalPrice > p.price);

  const getProductById = (id: string) => products.find(p => p.id === id);

  return {
    products: filteredProducts,
    allProducts: products,
    trendingProducts,
    newProducts,
    specialOffers,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    getProductById
  };
}