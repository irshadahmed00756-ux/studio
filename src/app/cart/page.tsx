'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { state: { items } } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 py-8 text-center">
        <h1 className="font-headline text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-4 text-muted-foreground">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild className="mt-6">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-headline text-3xl font-bold">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
