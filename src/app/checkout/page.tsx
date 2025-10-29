'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Landmark, Truck } from 'lucide-react';
import { Label } from '@/components/ui/label';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  paymentMethod: z.enum(['cod', 'upi', 'card'], {
    required_error: "You need to select a payment method.",
  }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === 'card') {
    return (
      !!data.cardNumber &&
      /^\d{16}$/.test(data.cardNumber) &&
      !!data.expiryDate &&
      /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate) &&
      !!data.cvc &&
      /^\d{3,4}$/.test(data.cvc)
    );
  }
  return true;
}, {
  message: "Please enter valid card details.",
  path: ['cardNumber'], // You can associate the error with a specific field if you want
});

export default function CheckoutPage() {
  const { state: { items }, dispatch } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items, router]);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '', email: '', address: '', city: '', postalCode: '', country: '',
    },
  });

  const paymentMethod = form.watch('paymentMethod');
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    console.log('Order placed:', data);
    toast({
      title: 'Order Placed!',
      description: 'Thank you for your purchase.',
    });
    dispatch({ type: 'CLEAR_CART' });
    router.push('/checkout/success');
  };

  if (items.length === 0) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-headline text-3xl font-bold">Checkout</h1>
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="space-y-8">
              <Card>
                <CardHeader><CardTitle className="font-headline">Shipping Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="postalCode" render={({ field }) => (
                        <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                </CardContent>
              </Card>

               <Card>
                <CardHeader><CardTitle className="font-headline">Payment Method</CardTitle></CardHeader>
                <CardContent>
                   <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-4 md:grid-cols-1"
                          >
                            <FormItem>
                              <Label className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 has-[input:checked]:border-primary">
                                <FormControl>
                                  <RadioGroupItem value="card" className="sr-only" />
                                </FormControl>
                                <CreditCard className="h-6 w-6" />
                                <div className="flex-grow">
                                  <p className="font-semibold">Credit/Debit Card</p>
                                  <p className="text-sm text-muted-foreground">Pay with Visa, Mastercard, or AMEX</p>
                                </div>
                              </Label>
                            </FormItem>
                             <FormItem>
                              <Label className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 has-[input:checked]:border-primary">
                                <FormControl>
                                  <RadioGroupItem value="upi" className="sr-only" />
                                </FormControl>
                                <Landmark className="h-6 w-6" />
                                <div className="flex-grow">
                                  <p className="font-semibold">UPI</p>
                                  <p className="text-sm text-muted-foreground">Pay with any UPI app</p>
                                </div>
                              </Label>
                            </FormItem>
                             <FormItem>
                              <Label className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 has-[input:checked]:border-primary">
                                <FormControl>
                                  <RadioGroupItem value="cod" className="sr-only" />
                                </FormControl>
                                <Truck className="h-6 w-6" />
                                <div className="flex-grow">
                                  <p className="font-semibold">Cash on Delivery (COD)</p>
                                  <p className="text-sm text-muted-foreground">Pay in cash upon delivery</p>
                                </div>
                              </Label>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="pt-2" />
                      </FormItem>
                    )}
                  />
                  {paymentMethod === 'card' && (
                    <div className="mt-6 space-y-4 rounded-md border bg-muted/50 p-4">
                       <FormField control={form.control} name="cardNumber" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="expiryDate" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="cvc" render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl><Input placeholder="123" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
          <div className="lg:col-span-2">
            <Card className="sticky top-20">
                <CardHeader><CardTitle className="font-headline">Order Summary</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                   <Button type="submit" size="lg" className="w-full mt-6">Place Order</Button>
                </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
