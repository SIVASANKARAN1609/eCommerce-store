import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t mt-20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                ShopVibe
              </span>
            </div>
            <p className="text-muted-foreground mb-6">
              A colorful, energetic online store that feels like browsing a lively street market turned digital.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Shop</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="/categories/electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
              <li><Link href="/categories/fashion" className="hover:text-primary transition-colors">Fashion</Link></li>
              <li><Link href="/categories/beauty" className="hover:text-primary transition-colors">Beauty</Link></li>
              <li><Link href="/categories/home-kitchen" className="hover:text-primary transition-colors">Home & Kitchen</Link></li>
              <li><Link href="/categories/sports" className="hover:text-primary transition-colors">Sports</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Account</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">View Cart</Link></li>
              <li><Link href="/wishlist" className="hover:text-primary transition-colors">My Wishlist</Link></li>
              <li><Link href="/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Ticket</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>123 Vibe Street, Creative City, 10010</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>hello@shopvibe.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ShopVibe. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}