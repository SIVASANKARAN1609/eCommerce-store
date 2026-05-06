import { motion } from 'framer-motion';
import { useLocation, Link } from 'wouter';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [, setLocation] = useLocation();

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    // Requires login check
    const user = localStorage.getItem('shopvibe_user');
    if (!user) {
      toast("Please login to place an order");
      setLocation('/login');
      return;
    }

    placeOrder(cart, total);
    clearCart();
    toast.success("Order placed successfully! 🎉");
    setLocation('/orders');
  };

  if (cart.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-24 flex flex-col items-center text-center"
      >
        <div className="w-32 h-32 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Let's fix that!
        </p>
        <Link href="/categories">
          <Button size="lg" className="rounded-full font-bold px-8">
            Start Shopping
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
      <h1 className="text-3xl md:text-4xl font-black mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div 
              layout
              key={`${item.productId}-${item.color}`}
              className="flex flex-col sm:flex-row gap-6 p-4 rounded-2xl border bg-card relative group"
            >
              <Link href={`/product/${item.productId}`}>
                <div className="w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer flex-shrink-0">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
              </Link>
              
              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-1">
                      <Link href={`/product/${item.productId}`} className="hover:text-primary transition-colors">
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.product.brand}</p>
                    
                    {item.color && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Color:</span>
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-xl">${(item.product.price * item.quantity).toFixed(2)}</div>
                    {item.quantity > 1 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        ${item.product.price.toFixed(2)} each
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center bg-muted rounded-xl p-1">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.productId, item.color)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-muted/30 rounded-3xl p-8 border sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <span className="font-black text-3xl">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group"
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}