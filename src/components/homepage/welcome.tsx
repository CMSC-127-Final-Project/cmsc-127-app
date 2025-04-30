'use client';

import { FaUser } from 'react-icons/fa';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Welcome({ user_id, nickname }: { user_id: string, nickname: string }) {
  const [username, setUsername] = useState<string>();
  useEffect(() => {
    const loadNickname = async () => {
      if(nickname) {
        setUsername(nickname);
      } else {
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
      }
    };
    loadNickname();
  }, [user_id, nickname]);

  return (
    <div className="p-4 md:p-6 md:ml-16">
      <h1 className="text-2xl md:text-5xl font-bold font-raleway flex flex-wrap items-center gap-2">
        Welcome, {username}!<span className="text-2xl md:text-5xl">👋</span>
        <span className="bg-[#5D1A0B] text-white text-[10px] md:text-sm font-roboto font-normal px-2 py-[2px] md:px-3 md:py-2 rounded-xl flex items-center gap-1">
          <FaUser className="text-[10px] md:text-base" />
          User
        </span>
      </h1>
      <p className="text-gray-900 mt-1 text-[10px] md:text-sm font-raleway ml-1 md:ml-2">
        Here are your upcoming reservations. Modify or cancel your reservations anytime.
      </p>
    </div>
  );
}
