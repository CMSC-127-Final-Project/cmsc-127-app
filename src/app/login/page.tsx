import LoginPage from '@/components/login/loginForm';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your account',
};

export default async function Page() {
  const cookieStore = await cookies();
  if (cookieStore.has('access_token')) {
    redirect('/homepage');
  }
  return <LoginPage />;
}
