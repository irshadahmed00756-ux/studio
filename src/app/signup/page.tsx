'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult, updateProfile } from 'firebase/auth';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
});

const otpSchema = z.object({
  otp: z.string().min(6, { message: 'OTP must be 6 digits.' }),
});

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (auth && recaptchaContainerRef.current) {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
      const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        size: 'invisible',
        callback: (response: any) => {},
        'expired-callback': () => {}
      });
      setRecaptchaVerifier(verifier);

      return () => {
        verifier.clear();
      };
    }
  }, [auth]);

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  useEffect(() => {
    if (isOtpSent) {
      otpForm.reset({ otp: '' });
    }
  }, [isOtpSent, otpForm]);

  const onSendOtp = async (data: z.infer<typeof signupSchema>) => {
    if (!recaptchaVerifier) {
      toast({
        title: 'reCAPTCHA not ready',
        description: 'Please wait a moment and try again.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      const phoneNumber = data.phone.startsWith('+') ? data.phone : `+${data.phone}`;
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'We have sent a one-time password to your phone number.',
      });
    } catch (error: any) {
      console.error('OTP send failed', error);
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
    if (!confirmationResult || !firestore) return;
    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(data.otp);
      const user = userCredential.user;
      
      const signupData = signupForm.getValues();
      await updateProfile(user, {
        displayName: signupData.name,
      });

      const userDocRef = doc(firestore, 'users', user.uid);
      setDocumentNonBlocking(userDocRef, {
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        createdAt: new Date(),
      }, { merge: true });

      router.push('/account');
    } catch (error: any) {
      console.error('OTP verification/signup failed', error);
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'An error occurred during sign up.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Logo className="mx-auto mb-4" />
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>
            {isOtpSent ? 'Enter the OTP to verify your phone' : 'Enter your details to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isOtpSent ? (
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSendOtp)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Aesthetic Nasra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} autoComplete="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
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
                        <Input placeholder="123456" {...field} autoComplete="one-time-code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Verify & Create Account'}
                </Button>
              </form>
            </Form>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
      <div ref={recaptchaContainerRef}></div>
    </div>
  );
}
