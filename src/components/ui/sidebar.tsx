'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!isOpen) return;
      if (sidebarRef.current && sidebarRef.current.contains(target)) return;
      if (target.closest('[data-hamburger-button]')) return;

      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const links = [
    { title: 'Dashboard', href: '/homepage' },
    { title: 'Profile and Preferences', href: '/profile' },
    { title: 'Change Password', href: '/profile?tab=security' },
    { title: 'Help and Support', href: '/support' },
  ];

  return (
    <>
      <div
        ref={sidebarRef}
        data-sidebar="true"
        className={`fixed top-0 left-0 h-full w-56 bg-white dark:bg-gray-900 shadow-md z-50 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pt-[72px] md:pt-[96px] overflow-y-auto h-full">
          <nav className="p-4">
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                      pathname === link.href ? 'font-medium bg-gray-100 dark:bg-gray-800' : ''
                    }`}
                    onClick={onClose}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
