import { Product } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage = "No products found." }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Nothing here!</h3>
        <p className="text-muted-foreground max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}