import { motion } from 'framer-motion';
import { CategoryCard } from '../components/CategoryCard';
import { categories } from '../data/categories';

export default function CategoriesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 pb-24"
    >
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4">All Categories</h1>
        <p className="text-lg text-muted-foreground">
          Explore our wide range of carefully curated products across multiple categories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>
    </motion.div>
  );
}