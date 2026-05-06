import { motion } from 'framer-motion';
import { PackageOpen, Clock } from 'lucide-react';
import { Link } from 'wouter';
import { useOrders } from '../hooks/useOrders';
import { useProducts } from '../hooks/useProducts';
import { OrderTracker } from '../components/OrderTracker';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { orders } = useOrders();
  const { getProductById } = useProducts();

  if (orders.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-24 flex flex-col items-center text-center"
      >
        <div className="w-32 h-32 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-8">
          <PackageOpen className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-bold mb-4">No orders yet</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          You haven't placed any orders. Start exploring our collection to find something you'll love.
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
      className="container mx-auto px-4 py-12 pb-24 max-w-4xl"
    >
      <h1 className="text-3xl md:text-4xl font-black mb-8">Order History</h1>

      <div className="space-y-8">
        {orders.map((order, i) => {
          // Calculate an artificial status if the order is very new
          // For demo purposes, we'll advance the status based on how old the order is
          const orderDate = new Date(order.date);
          const now = new Date();
          const minutesDiff = (now.getTime() - orderDate.getTime()) / 60000;
          
          let displayStatus = order.status;
          if (minutesDiff > 1 && displayStatus < 1) displayStatus = 1;
          if (minutesDiff > 5 && displayStatus < 2) displayStatus = 2;
          if (minutesDiff > 10 && displayStatus < 3) displayStatus = 3;
          if (minutesDiff > 20 && displayStatus < 4) displayStatus = 4;

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={order.id} 
              className="bg-card border rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="bg-muted/50 p-6 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> 
                    {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="font-bold text-lg">Order #{order.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
                  <div className="font-black text-xl text-primary">${order.total.toFixed(2)}</div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <OrderTracker status={displayStatus} />
              </div>

              <div className="p-6 bg-muted/20 border-t">
                <h3 className="font-bold mb-4">Items in this order</h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-semibold text-sm">
                          ${(product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}