'use client';

import { useRouter } from 'next/navigation';
import { Home, LogOut } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useState } from 'react';

export default function ProfileSidebar() {
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
    <div className="w-full md:w-1/4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-raleway">Account Options</CardTitle>
        </CardHeader>
        <CardContent className="p-0 font-raleway">
          <div className="divide-y">
            <div
              className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
              onClick={() => router.push('/homepage')}
            >
              <Home className="h-4 w-4 mr-2 text-[#6b1d1d]" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </div>
            <div
              className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center ${
                isSigningOut ? 'opacity-50 pointer-events-none' : ''
              }`}
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2 text-[#6b1d1d]" />
              <span className="text-sm font-medium">
                {isSigningOut ? 'Signing out...' : 'Sign out'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
