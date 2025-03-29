import SignupForm from '@/components/signupForm';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full flex-col justify-center sm:w-[45rem] sm:bg-background sm:rounded-lg sm:shadow-lg sm:p-10">
        <div className="sm:mx-auto sm:w-[500px] space-y-8">
          <Image src="/up_logo.png" alt="Logo" width={175} height={175} className="mx-auto" />
          <div className="flex flex-col text-left">
            <h1 className="text-xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground font-raleway">
              Enter your details below to create your account
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
