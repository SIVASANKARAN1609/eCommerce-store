import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'wouter';
import { useWishlist } from '../hooks/useWishlist';
import { ProductGrid } from '../components/ProductGrid';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { wishlistProducts } = useWishlist();

  if (wishlistProducts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-24 flex flex-col items-center text-center"
      >
        <div className="w-32 h-32 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-8">
          <Heart className="w-16 h-16 fill-destructive text-destructive" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Save items you love by clicking the heart icon on products. They'll be waiting for you here.
        </p>
        <Link href="/categories">
          <Button size="lg" className="rounded-full font-bold px-8">
            Discover Products
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 pb-24"
    >
      <div className="flex items-center gap-4 mb-8">
        <Heart className="w-8 h-8 fill-destructive text-destructive" />
        <h1 className="text-3xl md:text-4xl font-black">Your Wishlist</h1>
      </div>
      
      <p className="text-muted-foreground mb-8">
        {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
      </p>

      <ProductGrid products={wishlistProducts} />
    </motion.div>
  );
}