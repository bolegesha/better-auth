'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signInFormSchema } from "@/lib/auth-schema";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    console.group('🔑 Sign In Process');
    console.log('📝 Form submission:', { email: values.email });

    const { email, password } = values;
    try {
        const { data, error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/profile",
        }, {
            onRequest: () => {
                console.log('📤 Sending auth request');
                toast({
                    title: "Please wait...",
                })
            },
            onSuccess: () => {
                console.log('✅ Auth successful');
                console.log('🔄 Resetting form');
                form.reset()
            },
            onError: (ctx) => {
                console.error('❌ Auth error:', {
                    message: ctx.error.message,
                    error: ctx.error
                });
                alert(ctx.error.message);
            },
        });

        if (data) {
            console.log('📥 Auth response:', {
                success: true,
                userId: data.user?.id,
            });
        }
    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
    console.groupEnd();
}

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className='flex justify-center'>
        <p className='text-sm text-muted-foreground'>
          Don&apos;t have an account yet?{' '}
          <Link href='/sign-up' className='text-primary hover:underline'>
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>

  )
}