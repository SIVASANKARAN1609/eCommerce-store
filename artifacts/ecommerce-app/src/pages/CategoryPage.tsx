import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { categories } from '../data/categories';
import { ProductGrid } from '../components/ProductGrid';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function CategoryPage() {
  const [, params] = useRoute('/categories/:slug');
  const slug = params?.slug;
  const category = categories.find(c => c.slug === slug);
  
  const { 
    products, 
    setSelectedCategory, 
    priceRange, 
    setPriceRange,
    searchQuery,
    setSearchQuery
  } = useProducts();

  useEffect(() => {
    if (slug) {
      setSelectedCategory(slug);
    }
    return () => setSelectedCategory(null);
  }, [slug, setSelectedCategory]);

  if (!category) {
    return <div className="container py-20 text-center">Category not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 pb-24"
    >
      {/* Category Header */}
      <div className={`w-full rounded-3xl p-8 md:p-12 mb-8 ${category.color} bg-opacity-20`}>
        <h1 className="text-4xl md:text-5xl font-black mb-4">{category.name}</h1>
        <p className="text-lg opacity-80 max-w-xl">
          Discover the best {category.name.toLowerCase()} tailored just for you.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Search within category</label>
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 rounded-lg border bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">Price Range</label>
                  <span className="text-xs text-muted-foreground">${priceRange[0]} - ${priceRange[1]}</span>
                </div>
                <Slider
                  defaultValue={[0, 2000]}
                  max={2000}
                  step={10}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={(val) => setPriceRange([val[0], val[1]])}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Trigger & Product Grid */}
        <div className="flex-1">
          <div className="md:hidden flex items-center justify-between mb-6">
            <span className="font-medium">{products.length} products</span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your product search</SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search within category</label>
                    <input 
                      type="text" 
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 rounded-lg border bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-medium">Price Range</label>
                      <span className="text-xs text-muted-foreground">${priceRange[0]} - ${priceRange[1]}</span>
                    </div>
                    <Slider
                      defaultValue={[0, 2000]}
                      max={2000}
                      step={10}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={(val) => setPriceRange([val[0], val[1]])}
                      className="w-full"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:block mb-6">
            <span className="font-medium text-muted-foreground">{products.length} products found</span>
          </div>

          <ProductGrid products={products} />
        </div>
      </div>
    </motion.div>
  );
}