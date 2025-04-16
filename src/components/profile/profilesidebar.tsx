'use client';

import { useRouter } from 'next/navigation';
import { Home, User, Settings, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ProfileSidebar() {
  const router = useRouter();
  return (
    <div className="w-full md:w-1/4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Options</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <div
              className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
              onClick={() => router.push('/homepage')}
            >
              <Home className="h-4 w-4 mr-2 text-[#6b1d1d]" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </div>
            <div className="p-3 hover:bg-gray-50 cursor-pointer flex items-center">
              <User className="h-4 w-4 mr-2 text-[#6b1d1d]" />
              <span className="text-sm font-medium">Account and Profile Management</span>
            </div>
            <div className="p-3 hover:bg-gray-50 cursor-pointer flex items-center">
              <Settings className="h-4 w-4 mr-2 text-[#6b1d1d]" />
              <span className="text-sm">Settings</span>
            </div>
            <div
              className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
              onClick={() => router.push('/support')}
            >
              <HelpCircle className="h-4 w-4 mr-2 text-[#6b1d1d]" />
              <span className="text-sm">Help and Support</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
