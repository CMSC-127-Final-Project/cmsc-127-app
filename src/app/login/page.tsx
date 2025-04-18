import LoginPage from '@/components/login/loginForm';
import { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign in',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Sign in to your account',
};

export default async function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex justify-center">
          <Image
            src="/up_logo.png"
            alt="University of the Philippines Mindanao Logo"
            width={180}
            height={180}
            priority
          />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-muted-foreground-900">
            Sign in
          </CardTitle>
          <CardDescription className="text-muted-foreground-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <LoginPage />
        <div className="w-full text-center text-sm text-muted-foreground underline-offset-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline hover:text-primary">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
