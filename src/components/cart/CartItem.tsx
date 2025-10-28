'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const { dispatch } = useCart();
  const { toast } = useToast();
  const image = PlaceHolderImages.find((img) => img.id === item.product.imageId);

  const handleQuantityChange = (quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.product.id, quantity } });
  };

  const handleRemoveItem = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: item.product.id } });
    toast({
      title: 'Item removed',
      description: `${item.product.name} has been removed from your cart.`,
      variant: 'destructive',
    });
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
          {image && (
            <Image
              src={image.imageUrl}
              alt={item.product.name}
              data-ai-hint={image.imageHint}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex-grow">
          <Link href={`/products/${item.product.id}`} className="font-headline font-semibold hover:underline">
            {item.product.name}
          </Link>
          <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
          <div className="mt-2 flex items-center">
            <label htmlFor={`quantity-${item.product.id}`} className="sr-only">
              Quantity
            </label>
            <Input
              id={`quantity-${item.product.id}`}
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
              className="h-8 w-16"
            />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
          <Button variant="ghost" size="icon" onClick={handleRemoveItem}>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
