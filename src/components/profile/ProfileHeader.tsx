'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ProfileManagement() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const res = await fetch('/api/auth/signout', { method: 'GET' });
      const data = await res.json();

      if (res.ok) {
        router.push('/login');
      } else {
        console.error(data.error);
        alert('Sign-out failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-out:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Welcome, Useroo! 👋</CardTitle>
          <Button
            onClick={handleSignOut}
            disabled={isSigningOut}
            variant="destructive"
            size="sm"
            className="bg-[#6b1d1d] hover:bg-[#5a1818] ${
                isSigningOut
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#5D1A0B] hover:bg-[#5d0b0be7]'
              } text-white text-sm font-roboto rounded-2xl`"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </CardHeader>
    </Card>
  );
}
