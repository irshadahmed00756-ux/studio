'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const phoneSchema = z.object({
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
});

const otpSchema = z.object({
  otp: z.string().min(6, { message: 'OTP must be 6 digits.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const setupRecaptcha = () => {
    // Make sure you have a div with id="recaptcha-container" in your component
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      });
    }
  };

  const onSendOtp = async (data: z.infer<typeof phoneSchema>) => {
    setLoading(true);
    otpForm.resetField('otp'); // Clear the OTP field before sending a new one
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      // Make sure to format the phone number in E.164 format
      const phoneNumber = data.phone.startsWith('+') ? data.phone : `+${data.phone}`;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'An OTP has been sent to your phone number.',
      });
    } catch (error: any) {
      console.error('SMS not sent', error);
      toast({
        title: 'Failed to Send OTP',
        description: error.message || 'Please check the phone number and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (data: z.infer<typeof otpSchema>) => {
    if (!confirmationResult) return;
    setLoading(true);
    try {
      await confirmationResult.confirm(data.otp);
      router.push('/account');
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: 'The OTP is incorrect. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    otpForm.reset();
    setIsOtpSent(false);
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div id="recaptcha-container"></div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Logo className="mx-auto mb-4" />
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            {isOtpSent ? 'Enter the OTP sent to your phone' : 'Enter your phone number to log in'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isOtpSent ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 123 456 7890" {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="123456"
                          maxLength={6}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Log In'}
                </Button>
                 <Button variant="link" size="sm" onClick={handleBack} className="w-full">
                    Back to phone number
                  </Button>
              </form>
            </Form>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}
