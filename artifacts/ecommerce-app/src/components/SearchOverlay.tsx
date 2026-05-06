import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useProducts } from '../hooks/useProducts';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const { allProducts } = useProducts();
  const [, setLocation] = useLocation();

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const searchResults = query.length > 1 
    ? allProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelect = (id: string) => {
    onClose();
    setLocation(`/product/${id}`);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="relative w-full bg-card border-b shadow-2xl z-10"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <Search className="w-6 h-6 text-muted-foreground" />
                <input 
                  type="text"
                  autoFocus
                  placeholder="Search for products, brands, categories..."
                  className="flex-1 bg-transparent border-none outline-none text-xl md:text-2xl placeholder:text-muted-foreground h-14"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted bg-muted/50 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {query.length > 1 && (
                <div className="mt-8 pb-4 border-t pt-6">
                  {searchResults.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Results</h3>
                      <div className="flex flex-col gap-2">
                        {searchResults.map(product => (
                          <div 
                            key={product.id}
                            onClick={() => handleSelect(product.id)}
                            className="flex items-center gap-4 p-2 rounded-xl hover:bg-muted cursor-pointer transition-colors"
                          >
                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1">
                              <h4 className="font-semibold">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                            <span className="font-bold">${product.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No products found for "{query}"</p>
                    </div>
                  )}
                </div>
              )}

              {query.length <= 1 && (
                <div className="mt-8 pb-4 border-t pt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Trending Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Smartphones", "Summer Dresses", "Headphones", "Yoga Mats", "Coffee Mugs"].map(term => (
                      <button 
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}