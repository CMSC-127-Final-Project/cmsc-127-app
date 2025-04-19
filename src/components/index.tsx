'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IndexPage({ action }: { action: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (action) {
      router.push('/homepage');
    } else {
      router.push('/login');
    }
  }, [router, action]);

  return null;
}
