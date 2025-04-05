'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IndexPage({ action }: { action: string }) {
  const router = useRouter();

  useEffect(() => {
    if (action === 'access_token') {
      router.push('/homepage');
    } else {
      router.push('/login');
    }
  }, [router, action]);

  return null;
}
