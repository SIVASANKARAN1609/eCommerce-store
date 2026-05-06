import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Laptop, Shirt, Sparkles, Home, Dumbbell, Book } from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: string;
    slug: string;
    name: string;
    color: string;
    icon: string;
  };
  index?: number;
}

const icons: Record<string, React.ElementType> = {
  Laptop,
  Shirt,
  Sparkles,
  Home,
  Dumbbell,
  Book
};

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const Icon = icons[category.icon] || Home;

  return (
    <Link href={`/categories/${category.slug}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={`group cursor-pointer rounded-3xl p-6 h-40 flex flex-col justify-between overflow-hidden relative ${category.color} transition-transform hover:-translate-y-2 hover:shadow-lg`}
      >
        <div className="absolute -right-6 -bottom-6 opacity-20 transform group-hover:scale-125 transition-transform duration-500">
          <Icon size={120} strokeWidth={1} />
        </div>
        
        <div className="bg-background/80 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold">{category.name}</h3>
          <p className="text-sm font-medium opacity-80 mt-1 group-hover:underline underline-offset-4">
            Shop now →
          </p>
        </div>
      </motion.div>
    </Link>
  );
}