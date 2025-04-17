import LoginPage from '@/components/login/loginForm';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Sign in',
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
        <LoginPage />;
      </Card>
    </div>
  );
}
