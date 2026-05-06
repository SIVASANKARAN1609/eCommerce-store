import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { ProductGrid } from '../components/ProductGrid';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { useProducts } from '../hooks/useProducts';
import { categories } from '../data/categories';

export default function HomePage() {
  const { trendingProducts, specialOffers } = useProducts();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pb-20"
    >
      <HeroBanner />

      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <span className="text-primary font-medium hover:underline cursor-pointer">View all</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trendingProducts.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl p-8 md:p-12 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Offers Just For You</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Grab these limited time deals before they're gone. Handpicked selections with major discounts.
              </p>
            </div>
            <div className="bg-background rounded-full px-6 py-3 font-bold text-primary shadow-sm border border-primary/20">
              Ends in 24:00:00
            </div>
          </div>
          
          <ProductGrid products={specialOffers.slice(0, 4)} />
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden aspect-video cursor-pointer">
              <img 
                src={`https://picsum.photos/seed/video${i}/600/400`} 
                alt={`Video preview ${i}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg drop-shadow-md">
                  {i === 1 ? "Summer Lookbook" : i === 2 ? "Tech Review: Zenith Laptop" : "Home Decor Tips"}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}