'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { getProducts, type Product } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { user, isUserLoading: authLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && firestore) {
      const allProducts = getProducts();
      const wishlistRef = collection(firestore, 'users', user.uid, 'wishlist');
      
      const unsubscribe = onSnapshot(wishlistRef, (snapshot) => {
        const wishlistIds = snapshot.docs.map(doc => doc.id);
        const products = allProducts.filter(p => wishlistIds.includes(p.id));
        setWishlistProducts(products);
        setLoading(false);
      });

      return () => unsubscribe();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, firestore]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!user) {
     return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-headline text-3xl font-bold">My Wishlist</h1>
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          <h2 className="text-2xl font-bold">Your Wishlist is Empty</h2>
          <p className="mt-2 text-muted-foreground">
            Explore our products and add your favorites to your wishlist!
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
