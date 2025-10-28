'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { Plus, CheckCircle, Heart } from 'lucide-react';
import { getProductById } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useProductHistory } from '@/hooks/use-product-history';
import ProductRecommendations from '@/components/products/ProductRecommendations';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, getDoc, deleteDoc } from 'firebase/firestore';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  const image = product ? PlaceHolderImages.find((img) => img.id === product.imageId) : undefined;
  
  const { user } = useAuth();
  const router = useRouter();
  const { dispatch } = useCart();
  const { toast } = useToast();
  const { addProductToHistory } = useProductHistory();

  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (product) {
      addProductToHistory(product.name);
    }
    if (user && product) {
      const checkWishlist = async () => {
        const wishlistRef = doc(db, 'users', user.uid, 'wishlist', product.id);
        const docSnap = await getDoc(wishlistRef);
        setIsInWishlist(docSnap.exists());
      };
      checkWishlist();
    }
  }, [product, addProductToHistory, user]);

  if (!product || !image) {
    notFound();
  }

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to manage your wishlist.',
        variant: 'destructive',
        action: <Button onClick={() => router.push('/login')}>Login</Button>
      });
      return;
    }

    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', product.id);

    try {
      if (isInWishlist) {
        await deleteDoc(wishlistRef);
        toast({
          title: 'Removed from Wishlist',
          description: `${product.name} has been removed from your wishlist.`,
        });
        setIsInWishlist(false);
      } else {
        await setDoc(wishlistRef, {
          productId: product.id,
          addedAt: serverTimestamp(),
        });
        toast({
          title: 'Added to Wishlist',
          description: `${product.name} has been added to your wishlist.`,
        });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast({
        title: 'Something went wrong',
        description: 'Could not update your wishlist. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={image.imageUrl}
              alt={product.name}
              data-ai-hint={image.imageHint}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        <div>
          <h1 className="font-headline text-4xl font-bold">{product.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{product.category}</p>
          <p className="mt-4 text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <Separator className="my-6" />
          <p className="text-foreground/80">{product.description}</p>
          
          {product.customization.length > 0 && (
            <div className="mt-6">
              <h3 className="font-headline text-lg font-semibold">Customization Options</h3>
              <ul className="mt-2 space-y-1">
                {product.customization.map((opt, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    {opt}
                  </li>
                ))}
              </ul>
               <p className="mt-2 text-xs text-muted-foreground">Contact us for custom orders.</p>
            </div>
          )}
          
          <div className="mt-8 flex items-center gap-4">
            <Button size="lg" onClick={handleAddToCart}>
              <Plus className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" onClick={handleWishlistToggle}>
              <Heart className={cn("mr-2 h-5 w-5", isInWishlist && "fill-current text-red-500")} />
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
          
           <Separator className="my-8" />

          <ProductRecommendations />
        </div>
      </div>
    </div>
  );
}
