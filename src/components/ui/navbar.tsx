'use client';

import { useState, useEffect } from 'react';
import { Menu, Bell, Info, Sun, Moon, UserCircle, LogOut } from 'lucide-react';

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSignOut = async () => {
    const res = await fetch('/api/signout', { method: 'POST' });
    const data = await res.json();
  
    if (res.ok) {
      alert(data.message);
      window.location.href = '/login'; // Redirect after sign out
    } else {
      console.error(data.error);
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
    <nav className="flex items-center justify-between bg-white dark:bg-gray-900 p-6 shadow-md border-b relative">
      {/* Left Section - Logo & Title */}
      <div className="flex items-center space-x-4">
        <button className="p-2">
          <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/upminlogo.png" alt="" className="w-14 h-11" />
        <span className="font-bold font-raleway text-gray-900 dark:text-white text-base leading-tight">
          College of Science <br />& Mathematics
        </span>
      </div>

      {/* Right Section - Icons & Profile Dropdown */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle & Date-Time */}
        <div className="flex items-center space-x-6">
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
          <Info className="w-5 h-5 text-gray-900 dark:text-white cursor-pointer" />
          <Bell className="w-5 h-5 text-gray-900 dark:text-white cursor-pointer" />
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="text-gray-900 dark:text-white font-medium font-roboto">Celeru00</span>
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
                    <p className="font-semibold font-raleway dark:text-white">Celeru00</p>
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
                  <button onClick={handleSignOut} className="w-28 mt-5 px-2 py-2 flex items-center justify-center space-x-2 bg-[#5D1A0B] text-white text-sm font-roboto hover:bg-[#5d0b0be7] rounded-2xl">
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
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
