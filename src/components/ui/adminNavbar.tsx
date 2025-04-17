'use client';

import { useState, useEffect } from 'react';
import { UserSearch, Sun, Moon, UserCircle, LogOut } from 'lucide-react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useRouter } from 'next/navigation';

export default function Navbar({ user_id }: { user_id: string }) {
  const [currentTime, setCurrentTime] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const [username, setUsername] = useState();
  useEffect(() => {
    const loadNickname = async () => {
      try {
        const response = await fetch(`/api/user/${user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const data = await response.json();
        console.log('Fetched user data:', data);
        setUsername(data[0].nickname || 'User');
      } catch (err) {
        console.error('Internal Server Error:', err);
      }
    };
    loadNickname();
  }, [user_id]);

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
      setIsSigningOut(false); // Reset state if needed
    }
  };

  // Update date & time format
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
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Dark Mode Toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 md:p-6 shadow-md border-b fixed w-full z-50">
      {/* Left Section - Logo & Title */}
      <div className="flex items-center space-x-4">
        <RxHamburgerMenu className="w-5 h-5 text-gray-900 dark:text-white cursor-pointer" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/upminlogo.png" alt="" className="w-10 h-8 md:w-14 md:h-11" />
        <span className="hidden md:block font-bold font-raleway text-gray-900 dark:text-white text-sm md:text-base leading-tight">
          College of Science <br />& Mathematics
        </span>
      </div>

      {/* Right Section - Icons & Profile Dropdown */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle & Date-Time */}
        <div className="hidden md:flex items-center space-x-6">
          <span className="text-gray-900 dark:text-white font-medium font-roboto">
            {currentTime}
          </span>
          <button onClick={() => setDarkMode(!darkMode)} className="focus:outline-none">
            {darkMode ? (
              <Moon className="w-5 h-5 text-yellow-300 cursor-pointer" />
            ) : (
              <Sun className="w-5 h-5 text-gray-900 cursor-pointer" />
            )}
          </button>
          <UserSearch
            className="w-5 h-5 text-gray-900 dark:text-white cursor-pointer"
            onClick={
              () => router.push('/users') // Redirect to search page
            }
          />
        </div>

        {/* Mobile Icons */}
        <div className="flex md:hidden items-center space-x-4">
          <UserSearch className="w-5 h-5 text-gray-900 dark:text-white cursor-pointer" />
          <button onClick={() => setDarkMode(!darkMode)} className="focus:outline-none">
            {darkMode ? (
              <Moon className="w-5 h-5 text-yellow-300 cursor-pointer" />
            ) : (
              <Sun className="w-5 h-5 text-gray-900 cursor-pointer" />
            )}
          </button>
        </div>

        {/* Profile Dropdown */}
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

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 h-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              {/* Triangle */}
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-gray-800 border-t border-l border-gray-200 dark:border-gray-700 rotate-45"></div>

              {/* Menu Items */}
              <div className="p-3">
                <div className="flex items-center gap-2 border-b pb-2 dark:border-gray-600">
                  <UserCircle className="text-gray-600 dark:text-gray-300 w-12 h-12" />
                  <div>
                    <p className="font-semibold font-raleway dark:text-white">{username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-raleway">
                      20XX-XXXXX
                    </p>
                  </div>
                </div>
                <ul className="mt-2 text-sm font-raleway border-b pb-2 dark:border-gray-600">
                  <li className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    Account and Profile Management
                  </li>
                  <li className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    Settings
                  </li>
                  <li className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    Help and Support
                  </li>
                </ul>
                {/* Sign Out Button at the Bottom */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut} // Disable button while signing out
                    className={`${
                      isSigningOut ? 'w-36' : 'w-28'
                    } mt-5 px-2 py-2 flex items-center justify-center space-x-2 ${
                      isSigningOut
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#5D1A0B] hover:bg-[#5d0b0be7]'
                    } text-white text-sm font-roboto rounded-2xl`} // Dynamic width
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
  );
}
