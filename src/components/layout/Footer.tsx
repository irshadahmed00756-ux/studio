import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Handmade traditional and wedding items with a touch of gold.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            <div>
              <h3 className="font-headline font-semibold">Shop</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary">All Products</Link></li>
                <li><Link href="/products?category=Haldi%20Platters" className="text-sm text-muted-foreground hover:text-primary">Haldi Platters</Link></li>
                <li><Link href="/products?category=Mehndi%20Platters" className="text-sm text-muted-foreground hover:text-primary">Mehndi Platters</Link></li>
                <li><Link href="/products?category=Hampers" className="text-sm text-muted-foreground hover:text-primary">Hampers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold">About Us</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Our Story</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold">Follow Us</h3>
              <div className="mt-4 flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Aesthetic Nasra. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
