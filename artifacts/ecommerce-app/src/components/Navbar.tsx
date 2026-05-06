import { Link, useLocation } from 'wouter';
import { ShoppingCart, Heart, User, Search, Menu, Package, LogOut } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchOverlay } from './SearchOverlay';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                ShopVibe
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
              <Link href="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link>
              <Link href="/orders" className="hover:text-primary transition-colors">Orders</Link>
            </nav>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <div 
              className="relative group cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
              data-testid="button-open-search"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="h-10 w-full rounded-full bg-muted/50 border flex items-center pl-10 pr-4 text-sm text-muted-foreground group-hover:border-primary/50 transition-colors">
                Search for products...
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              className="md:hidden p-2 rounded-full hover:bg-muted"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Link href="/wishlist" className="p-2 rounded-full hover:bg-muted hidden sm:block relative">
              <Heart className="w-5 h-5" />
            </Link>

            <Link href="/cart" className="p-2 rounded-full hover:bg-muted relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 ring-primary ring-offset-2 transition-all">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {user?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    logout();
                    setLocation('/');
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}