'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductById, getProducts } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import OrderTracker from '@/components/account/OrderTracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';


const mockOrders = [
    { 
        id: 'AN12345', 
        date: '2023-10-26', 
        total: 80.00, 
        status: 'Delivered' as OrderStatus, 
        items: [
            { productId: 'hp-01', quantity: 1, price: 45.00 },
            { productId: 'ea-01', quantity: 1, price: 25.00 },
        ],
        shippingAddress: '123 Floral Lane, Weddington, Country 12345',
        paymentMethod: 'Credit Card',
        trackingNumber: '1Z999AA10123456784'
    },
    { 
        id: 'AN12346', 
        date: '2023-11-15', 
        total: 125.50, 
        status: 'Shipped' as OrderStatus,
        items: [
            { productId: 'mp-02', quantity: 1, price: 65.00 },
            { productId: 'rp-01', quantity: 1, price: 75.00 },
        ],
        shippingAddress: '456 Celebration Ave, Partyville, Country 67890',
        paymentMethod: 'UPI',
        trackingNumber: '1Z999AA10123456785'
    },
    { 
        id: 'AN12347', 
        date: '2023-11-20', 
        total: 45.00, 
        status: 'Processing' as OrderStatus,
        items: [
            { productId: 'di-03', quantity: 1, price: 45.00 },
        ],
        shippingAddress: '789 Decor St, Aesthetica, Country 11223',
        paymentMethod: 'Cash on Delivery',
        trackingNumber: null
    },
];

export default function OrderDetailsPage() {
  const params = useParams();
  const { id } = params;
  const order = mockOrders.find(o => o.id === id);

  if (!order) {
    notFound();
  }

  const allProducts = getProducts();
  const orderItems = order.items.map(item => {
      const product = allProducts.find(p => p.id === item.productId);
      const image = product ? PlaceHolderImages.find(img => img.id === product.imageId) : undefined;
      return {
          ...item,
          product,
          image,
      }
  })

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
       <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/account?tab=orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTracker currentStatus={order.status} />
          {order.trackingNumber && (
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">Tracking Number: <span className="font-medium text-foreground">{order.trackingNumber}</span></p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {orderItems.map(item => (
                    <div key={item.productId} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                            {item.image && (
                                <Image 
                                    src={item.image.imageUrl}
                                    alt={item.product?.name || 'Product Image'}
                                    data-ai-hint={item.image.imageHint}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold">{item.product?.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{Number(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{order.total.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>₹0.00</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{order.total.toFixed(2)}</span>
                    </div>
                     <Separator />
                     <div>
                        <h4 className="mb-2 font-semibold">Shipping Address</h4>
                        <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                     </div>
                      <div>
                        <h4 className="mb-2 font-semibold">Payment Method</h4>
                        <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                     </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
