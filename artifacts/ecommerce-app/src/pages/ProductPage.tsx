import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Truck, RefreshCcw, ShieldCheck, User } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { StarRating } from '../components/StarRating';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export default function ProductPage() {
  const [, params] = useRoute('/product/:id');
  const id = params?.id;
  
  const { getProductById, trendingProducts } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isLiked } = useWishlist();
  
  const product = getProductById(id || '');
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    
    // Load comments
    if (id) {
      const savedComments = JSON.parse(localStorage.getItem('shopvibe_comments') || '{}');
      if (savedComments[id]) {
        setComments(savedComments[id]);
      }
    }
    
    window.scrollTo(0, 0);
  }, [product, id]);

  if (!product) {
    return <div className="container py-20 text-center">Product not found</div>;
  }

  const liked = isLiked(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedColor);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: JSON.parse(localStorage.getItem('shopvibe_user') || '{"name":"Guest User"}').name,
      text: newComment,
      date: new Date().toLocaleDateString()
    };
    
    const newComments = [comment, ...comments];
    setComments(newComments);
    
    const savedComments = JSON.parse(localStorage.getItem('shopvibe_comments') || '{}');
    savedComments[product.id] = newComments;
    localStorage.setItem('shopvibe_comments', JSON.stringify(savedComments));
    
    setNewComment('');
    toast.success("Review submitted!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 pb-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Left: Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
          <img 
            src={product.image.replace('400/400', '800/800')} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-6 right-6 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-background transition-colors"
          >
            <Heart className={`w-6 h-6 transition-colors ${liked ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
          </button>
          
          {product.isNew && (
            <div className="absolute top-6 left-6 bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg shadow-md">
              NEW ARRIVAL
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
            {product.brand}
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <StarRating productId={product.id} initialRating={product.rating} />
            <span className="text-sm text-muted-foreground underline cursor-pointer">
              {product.reviewCount} reviews
            </span>
          </div>
          
          <div className="flex items-end gap-4 mb-8">
            <span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xl text-muted-foreground line-through mb-1">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'border-primary scale-110 ring-4 ring-primary/20' : 'border-transparent hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center bg-muted rounded-2xl p-1 h-14">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center rounded-xl hover:bg-background transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-full flex items-center justify-center rounded-xl hover:bg-background transition-colors"
              >
                +
              </button>
            </div>
            
            <Button 
              size="lg" 
              className="h-14 flex-1 rounded-2xl text-lg font-bold gap-3 shadow-xl shadow-primary/20"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <RefreshCcw className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">2 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="description" className="w-full mb-16">
        <TabsList className="w-full justify-start border-b rounded-none h-auto bg-transparent p-0 space-x-8">
          <TabsTrigger value="description" className="text-lg py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
            Description
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-lg py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
            Reviews ({comments.length + product.reviewCount})
          </TabsTrigger>
          <TabsTrigger value="shipping" className="text-lg py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
            Shipping & Returns
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="pt-8">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">{product.description}</p>
            <p>Elevate your everyday experience with the {product.name}. Designed by {product.brand}, this premium product combines cutting-edge technology with elegant aesthetics. Whether you're upgrading your setup or looking for the perfect gift, this delivers exceptional value and uncompromising quality.</p>
            <ul>
              <li>Premium build quality and materials</li>
              <li>Designed for everyday durability</li>
              <li>Includes standard accessories</li>
              <li>Eco-friendly packaging</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl font-black">{product.rating}</span>
                <div>
                  <StarRating productId={product.id} initialRating={product.rating} readOnly />
                  <span className="text-sm text-muted-foreground block mt-1">Based on {product.reviewCount} ratings</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="bg-muted p-4 rounded-2xl">
                  <h4 className="font-bold mb-2">Write a review</h4>
                  <textarea 
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="What do you think about this product?"
                    className="w-full p-3 rounded-xl border bg-background mb-3 min-h-[100px] resize-none outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button onClick={handleAddComment} className="w-full rounded-xl">Submit Review</Button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="border-b pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {comment.author.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="font-bold">{comment.author}</h5>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                  </div>
                  <StarRating productId={`${product.id}-mock`} initialRating={5} readOnly />
                  <p className="mt-3 text-muted-foreground">{comment.text}</p>
                </div>
              ))}
              
              {/* Dummy initial review */}
              <div className="border-b pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold">Verified Buyer</h5>
                    <span className="text-xs text-muted-foreground">2 weeks ago</span>
                  </div>
                </div>
                <StarRating productId={`${product.id}-mock2`} initialRating={product.rating} readOnly />
                <p className="mt-3 text-muted-foreground">Absolutely love this product! The quality is amazing and it looks exactly like the pictures. Shipping was fast too.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="shipping" className="pt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted/50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Shipping Info</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><strong>Standard Shipping:</strong> 3-5 business days (Free)</li>
                <li><strong>Express Shipping:</strong> 1-2 business days ($15.00)</li>
                <li><strong>International:</strong> 7-14 business days ($30.00)</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><RefreshCcw className="w-5 h-5 text-accent" /> Returns Policy</h3>
              <p className="text-muted-foreground mb-3">We accept returns within 30 days of delivery for a full refund or exchange. The item must be unused and in its original packaging.</p>
              <p className="text-muted-foreground">Return shipping is free for all domestic orders.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}