import { motion } from 'framer-motion';
import { User, Package, Heart, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  if (!user) return null;

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Wishlist Items', value: wishlist.length, icon: Heart, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: 'Items in Cart', value: cart.length, icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 pb-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-card rounded-3xl border shadow-sm p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/30 to-accent/30" />
            
            <div className="relative z-10 flex flex-col items-center mt-8 mb-6 text-center">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-background shadow-xl flex items-center justify-center mb-4 relative">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-accent">
                  {user.name.substring(0, 2).toUpperCase()}
                </span>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-background rounded-full" />
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div className="space-y-2 mt-8">
              <Link href="/dashboard">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium cursor-pointer">
                  <User className="w-5 h-5" /> Account Overview
                </div>
              </Link>
              <Link href="/orders">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium cursor-pointer transition-colors">
                  <Package className="w-5 h-5 text-muted-foreground" /> My Orders
                </div>
              </Link>
              <Link href="/wishlist">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium cursor-pointer transition-colors">
                  <Heart className="w-5 h-5 text-muted-foreground" /> Wishlist
                </div>
              </Link>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium cursor-pointer transition-colors mt-8">
                <Settings className="w-5 h-5 text-muted-foreground" /> Settings
              </div>
              <div 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive font-medium cursor-pointer transition-colors"
              >
                <LogOut className="w-5 h-5" /> Logout
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
            <p className="text-muted-foreground">Here is what's happening with your account today.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index} 
                  className="bg-card border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card border rounded-3xl p-8 shadow-sm">
              <h3 className="font-bold text-lg mb-6">Recent Orders</h3>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50">
                      <div>
                        <div className="font-semibold text-sm">Order #{order.id}</div>
                        <div className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</div>
                      </div>
                      <div className="font-bold text-primary">${order.total.toFixed(2)}</div>
                    </div>
                  ))}
                  <Link href="/orders">
                    <Button variant="outline" className="w-full mt-4">View All Orders</Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No orders yet</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="relative z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-sm">
                  ShopVibe Club
                </span>
                <h3 className="font-black text-2xl mb-2">Gold Member</h3>
                <p className="text-white/80 mb-8 text-sm">
                  You're earning double points on every purchase!
                </p>
                <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-medium text-sm text-white/90">Points Balance</span>
                    <span className="font-black text-2xl">2,450</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2 mt-4">
                    <div className="bg-white rounded-full h-2 w-[70%]" />
                  </div>
                  <div className="text-xs text-white/70 mt-2 text-right">550 pts to Platinum</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}