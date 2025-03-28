import LoginPage from '@/components/loginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your account',
};

export default function Page() {
  return <LoginPage />;
}
