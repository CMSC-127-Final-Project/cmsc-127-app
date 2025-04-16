'use client';

import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

export default async function ManageUsers() {
    const router = useRouter();

    return (
        <div className="flex justify-center mt-4">
            <Button 
                className="bg-[#5D1A0B] text-white hover:bg-[#6b1d1d] transition-colors duration-300"
                onClick={() => {
                    router.push('/users');
                }}
            >
                Manage Users
            </Button>
        </div>
    );
};