import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Product } from '../data/products';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleWishlist, isLiked } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [, setLocation] = useLocation();

  const liked = isLiked(product.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(liked ? "Removed from wishlist" : "Added to wishlist", {
      icon: liked ? <Heart className="w-4 h-4" /> : <Heart className="w-4 h-4 fill-destructive text-destructive" />,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1, product.colors[0]);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col bg-card rounded-2xl border shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setLocation(`/product/${product.id}`)}
      role="button"
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img 
          src={product.image} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              NEW
            </span>
          )}
          {product.originalPrice > product.price && (
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              SALE
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-background transition-colors z-10"
          data-testid={`button-like-${product.id}`}
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
        </button>

        {/* Quick Add Button */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={handleAddToCart}
              className="absolute bottom-3 left-3 right-3 bg-primary text-primary-foreground py-2.5 rounded-xl font-medium shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all z-10"
              data-testid={`button-quick-add-${product.id}`}
            >
              <ShoppingCart className="w-4 h-4" />
              Quick Add
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-medium text-foreground">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-base line-clamp-1 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {product.colors && product.colors.length > 0 && (
            <div className="flex -space-x-1">
              {product.colors.slice(0, 3).map((color, i) => (
                <div 
                  key={i} 
                  className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
              {product.colors.length > 3 && (
                <div className="w-4 h-4 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[8px] font-bold">
                  +
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}