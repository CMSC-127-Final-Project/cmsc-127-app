'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { LogInIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast'; 
import { Key} from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const { toast } = useToast(); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const email = (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (event.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in both email and password fields.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password. Please try again.');
        } else if (response.status === 500) {
          throw new Error('Internal server error. Please try again later.');
        } else {
          throw new Error(result.error || 'Login failed. Please try again.');
        }
      }

      toast({
        title: 'Success',
        description: 'You have successfully logged in!',
      });

      router.push('/homepage');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      console.error('Login failed:', errorMessage);

      toast({
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="mb-1 block text-sm front-medium text-muted-foreground-700"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="w-full rounded"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              onClick={() => setShowPopup(true)}
            >
              Forgot password?
            </button>
            {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-white rounded shadow-md p-10 pb-5">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Key className="w-16 h-16 mb-4 " />
                    <p className="font-medium text-base text-gray-700">Forgot password?</p>
                    <div className="mt-2">
                      <p className="text-sm">
                        Please go to the Administrator's office and bring your ID card.
                      </p>
                    </div>
                  </div>
                  <button
                    className="mt-10 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark mx-auto block"
                    onClick={() => setShowPopup(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
          <div>
            <Input id="password" type={showPassword ? 'text' : 'password'} required />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>
          </div>
        </div>
        <div className="space-x-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="remember" className="h-4 w-4 rounded text-sm font-normal">
            Remember me
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col w-full gap-2">
        <Button
          className="flex w-full items-center justify-center"
          type="submit"
          disabled={isLoading}
        >
          <LogInIcon className="mr-2 h-4 w-4" />
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </CardFooter>
    </form>
  );
}