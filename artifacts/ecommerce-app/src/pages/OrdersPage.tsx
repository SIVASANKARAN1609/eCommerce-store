import { motion, AnimatePresence } from 'framer-motion';
import { PackageOpen, Clock, ChevronLeft, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import { useOrders } from '../hooks/useOrders';
import { useProducts } from '../hooks/useProducts';
import { OrderTracker } from '../components/OrderTracker';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const STEP_LABELS = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrdersPage() {
  const { orders, cancelOrder, removeOrder } = useOrders();
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
      <h1 className="text-3xl md:text-4xl font-black mb-2">Order History</h1>
      <p className="text-muted-foreground mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

      <AnimatePresence mode="popLayout">
        <div className="space-y-8">
          {orders.map((order, i) => {
            const isDelivered = order.status >= 4;
            const canCancel = order.status > 0 && order.status < 4;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                transition={{ delay: i * 0.08 }}
                key={order.id}
                className="bg-card border rounded-3xl overflow-hidden shadow-sm"
                data-testid={`order-card-${order.id}`}
              >
                {/* Header */}
                <div className="bg-muted/50 p-6 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      {' at '}
                      {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="font-bold text-lg">Order #{order.id}</div>
                    <div className={`text-xs mt-1 font-semibold px-2 py-0.5 rounded-full inline-block ${
                      isDelivered
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {STEP_LABELS[order.status]}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="font-black text-xl text-primary">${order.total.toFixed(2)}</div>
                  </div>
                </div>

                {/* Tracker */}
                <div className="p-6 md:p-8 pb-10">
                  <OrderTracker status={order.status} />
                </div>

                {/* Items */}
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
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm line-clamp-1">{product.name}</h4>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            {item.color && (
                              <div className="flex items-center gap-1 mt-1">
                                <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.color }} />
                              </div>
                            )}
                          </div>
                          <div className="font-semibold text-sm flex-shrink-0">
                            ${(product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {canCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-400"
                        onClick={() => {
                          cancelOrder(order.id);
                          toast.success(`Order reverted to "${STEP_LABELS[order.status - 1]}"`);
                        }}
                        data-testid={`button-cancel-${order.id}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Revert Step
                      </Button>
                    )}
                    {order.status === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full text-destructive border-destructive/30 hover:bg-destructive/5"
                        onClick={() => {
                          removeOrder(order.id);
                          toast.success('Order cancelled and removed.');
                        }}
                        data-testid={`button-remove-${order.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Cancel Order
                      </Button>
                    )}
                  </div>
                  {isDelivered && (
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                      ✓ Delivered successfully
                    </span>
                  )}
                  <Link href="/categories">
                    <Button variant="ghost" size="sm" className="rounded-full text-primary">
                      Buy Again
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}
