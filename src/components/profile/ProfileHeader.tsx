'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

export default function ProfileManagement({ user_id }: { user_id: string }) {
  const [username, setUsername] = useState();
  useEffect(() => {
    const loadNickname = async () => {
      try {
        const response = await fetch(`/api/user/${user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const data = await response.json();
        setUsername(data[0].nickname || 'User');
      } catch (err) {
        console.error('Internal Server Error:', err);
      }
    };
    loadNickname();
  }, [user_id]);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Welcome, {username} 👋</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </CardHeader>
    </Card>
  );
}
