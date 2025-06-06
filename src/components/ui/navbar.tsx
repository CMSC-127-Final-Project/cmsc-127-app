'use client';

import { useState, useEffect } from 'react';
import { Bell, LogOut } from 'lucide-react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useRouter } from 'next/navigation';
import Sidebar from './sidebar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export default function Navbar({
  user_id,
  nickname,
  id_number,
  profile_link,
}: {
  user_id: string;
  nickname: string;
  id_number: string;
  profile_link: string;
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [idNumber, setIdNumber] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [profileImg, setProfileImg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadNickname = async () => {
      if (nickname && id_number && profile_link) {
        setUsername(nickname);
        setIdNumber(id_number);
        setProfileImg(profile_link);
      } else {
        try {
          const response = await fetch(`/api/user/${user_id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data = await response.json();
          console.log('Fetched user data:', data);
          setUsername(data[0].nickname || 'User');
          setProfileImg(data[0].profile_image || 'https://avatar.iran.liara.run/public/18');
          if (data[0].role === 'Student') {
            setIdNumber(data[0].student_num || 'ID Number not available');
          } else {
            setIdNumber(data[0].instructor_id || 'ID Number not available');
          }
        } catch (err) {
          console.error('Internal Server Error:', err);
        }
      }
    };
    loadNickname();
  }, [user_id, nickname, id_number, profile_link]);

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

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(`${formattedDate} | ${formattedTime}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <nav className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 md:p-6 shadow-md border-b fixed w-full z-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="focus:outline-none"
            aria-label="Toggle sidebar menu"
            data-hamburger-button="true"
          >
            <RxHamburgerMenu className="w-5 h-5 text-gray-900 dark:text-white cursor-pointer" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/upminlogo.png" alt="" className="w-10 h-8 md:w-14 md:h-11" />
          <span className="hidden md:block font-bold font-raleway text-gray-900 dark:text-white text-sm md:text-base leading-tight">
            College of Science <br />& Mathematics
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-6">
            <span className="hidden md:inline text-gray-900 dark:text-white font-medium font-roboto">
              {currentTime}
            </span>
            <Bell className="w-5 h-5 text-gray-900 dark:text-white cursor-pointer" />
          </div>

          <div className="relative">
            <button
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-gray-900 dark:text-white font-medium font-roboto text-sm md:text-base">
                {username}
              </span>
              <span
                className={`text-gray-900 dark:text-white text-sm font-roboto transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              >
                ▾
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-gray-800 border-t border-l border-gray-200 dark:border-gray-700 rotate-45"></div>
                <div className="p-3">
                  <div className="flex items-center gap-4 border-b pb-2">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={profileImg} alt="Profile picture" />
                    </Avatar>
                    <div className="flex flex-col align-bottom">
                      <p className="font-semibold text-md font-raleway leading-4 dark:text-white">
                        {username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{idNumber}</p>
                    </div>
                  </div>
                  <ul className="mt-2 text-sm font-raleway border-b pb-2 dark:border-gray-600">
                    <li
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push('/profile');
                      }}
                    >
                      Profile & Settings
                    </li>
                  </ul>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className={`${
                        isSigningOut ? 'w-36' : 'w-28'
                      } mt-5 px-2 py-2 flex items-center justify-center space-x-2 ${
                        isSigningOut
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#5D1A0B] hover:bg-[#5d0b0be7]'
                      } text-white text-sm font-roboto rounded-2xl`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main-content pt-2 lg:pt-16">
        <div className="content-wrapper px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
          {/* Content will be rendered inside this wrapper */}
        </div>
      </main>
    </>
  );
}
