import { useState } from 'react';
import { useLocation, useSearch, Link } from 'wouter';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const redirect = params.get('redirect') || '/dashboard';
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    login(values.email, values.password);
    toast.success("Welcome back! You're signed in.");
    setLocation(redirect);
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            S
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-black tracking-tight">
          Sign in to ShopVibe
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Any email &amp; password works —{' '}
          <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-primary hover:text-primary/80 transition-colors">
            or create an account
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-card py-8 px-4 shadow-xl border rounded-3xl sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="h-12 rounded-xl bg-muted/50"
                        data-testid="input-email"
                        {...field}
                      />
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="h-12 rounded-xl bg-muted/50 pr-10"
                          placeholder="Any password works"
                          data-testid="input-password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 rounded-xl font-bold text-md"
                data-testid="button-submit"
              >
                <LogIn className="w-5 h-5 mr-2" /> Sign in
              </Button>
            </form>
          </Form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">Demo mode</span>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm text-muted-foreground text-center">
              Enter <span className="font-semibold text-foreground">any valid email</span> and{' '}
              <span className="font-semibold text-foreground">any password</span> — you'll be signed in instantly and redirected back to where you came from.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
