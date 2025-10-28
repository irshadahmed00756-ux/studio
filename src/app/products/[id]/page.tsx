'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Plus, CheckCircle } from 'lucide-react';
import { getProductById } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useProductHistory } from '@/hooks/use-product-history';
import ProductRecommendations from '@/components/products/ProductRecommendations';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  const image = product ? PlaceHolderImages.find((img) => img.id === product.imageId) : undefined;
  
  const { dispatch } = useCart();
  const { toast } = useToast();
  const { addProductToHistory } = useProductHistory();

  useEffect(() => {
    if (product) {
      addProductToHistory(product.name);
    }
  }, [product, addProductToHistory]);

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
          
          <div className="mt-8">
            <Button size="lg" onClick={handleAddToCart}>
              <Plus className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
          
           <Separator className="my-8" />

          <ProductRecommendations />
        </div>
      </div>
    </div>
  );
}
