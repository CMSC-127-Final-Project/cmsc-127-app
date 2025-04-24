'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { RxDotsHorizontal, RxPencil1, RxTrash, RxLockOpen1 } from 'react-icons/rx';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { List, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface User {
  auth_id: string;
  number: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  dept: string;
}

const DropdownPortal: React.FC<{
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
}> = ({ children, triggerRef, isOpen }) => {
  const [styles, setStyles] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (triggerRef.current && isOpen) {
      const rect = triggerRef.current.getBoundingClientRect();
      setStyles({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        zIndex: 9999,
      });
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(<div style={styles}>{children}</div>, document.body);
};

const handleUserAction = async (
  auth_id: string,
  successMessage: string,
  errorMessage: string,
  toast: (options: { title: string; description: string }) => void
) => {
  try {
    const response = await fetch(`/api/user/${auth_id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error(errorMessage);

    toast({ title: 'Success', description: successMessage });
  } catch (error) {
    console.error(error);
    toast({ title: 'Error', description: errorMessage });
  }
};

const manageUsers = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState<User[]>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdownId) setOpenDropdownId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdownId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/usersList', { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch reservations');
        const data = await response.json();
        const mappedUsers = data.map((user: any) => ({
          auth_id: user.auth_id,
          number: user.student_num || user.instructor_id || 'N/A',
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          dept: user.dept,
        }));
        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers);
        setShowEmptyState(mappedUsers.length === 0);
      } catch (err: any) {
        console.error('Error fetching users:', err.message);
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = () => {
    setHasSearched(true);

    const filtered = users.filter(user => {
      const firstNameMatch = user.firstName.toLowerCase().includes(firstName.toLowerCase());
      const lastNameMatch = user.lastName.toLowerCase().includes(lastName.toLowerCase());
      return firstNameMatch && lastNameMatch;
    });
    setFilteredUsers(filtered);
    setShowEmptyState(filtered.length === 0);
  };

  const handleClearSearch = () => {
    setFirstName('');
    setLastName('');
    setHasSearched(false);
    setFilteredUsers(users);
    setShowEmptyState(false);
  };

  useEffect(() => {
    const storedToast = localStorage.getItem('user-toast');
    if (storedToast) {
      const { title, description } = JSON.parse(storedToast);
      toast({ title, description });
      localStorage.removeItem('user-toast');
    }
  }, [toast]);

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl drop-shadow-[0_-4px_10px_rgba(0,0,0,0.1)] mx-4 md:mx-20 mt-1 mb-10 font-roboto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-lg md:text-2xl font-bold font-raleway text-gray-900">Find User</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8 font-roboto">
        <div className="space-y-2">
          <Label htmlFor="date">First Name</Label>
          <Input
            id="first-name"
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start-time">Last Name</Label>
          <div className="flex items-center">
            <Input
              id="last-name"
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <button
          onClick={handleClearSearch}
          className="bg-gray-200 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-gray-300 transition"
        >
          Clear
        </button>
        <button
          onClick={handleSearch}
          className="bg-[#5D1A0B] text-white px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-[#731f10] transition"
        >
          <Search className="text-white" size={20} />
          <span className="hidden md:block">Search</span>
        </button>
      </div>
      <div className="flex flex-row justify-between items-center mb-4">
        <h2 className="text-lg md:text-2xl font-bold font-raleway">Users</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden text-sm md:text-base">
          <thead>
            <tr className="bg-[#5D1A0B] text-white">
              <th className="px-2 md:px-4 py-2 w-[10%] min-w-[80px]">
                Identification
                <br /> Number
              </th>
              <th className="px-2 md:px-4 py-2 w-[15%] min-w-[110px]">First name</th>
              <th className="px-2 md:px-4 py-2 w-[15%] min-w-[110px]">Last name</th>
              <th className="px-2 md:px-4 py-2 w-[10%] min-w-[70px]">Email</th>
              <th className="px-2 md:px-4 py-2 w-[12%] min-w-[90px]">Phone</th>
              <th className="px-2 md:px-4 py-2 w-[12%] min-w-[90px]">Role</th>
              <th className="px-2 md:px-4 py-2 w-[10%] min-w-[80px]">Department</th>
              <th className="px-2 md:px-4 py-2 w-[10%] min-w-[80px] rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white text-center">
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers?.map(user => {
                const ref = (el: HTMLButtonElement | null) => {
                  dropdownRefs.current[user.auth_id] = el;
                };
                return (
                  <tr key={user.auth_id} className="border-t last:border-b">
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {user.number}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                      {user.firstName}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {user.lastName}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {user.email}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {user.phone}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">{user.role}</td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                      {user.dept}
                    </td>
                    <td className="px-0 md:px-0 py-5 relative text-center">
                      <button
                        ref={ref}
                        className="text-gray-500 px-2 py-1 rounded-md"
                        onClick={e => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === user.auth_id ? null : user.auth_id);
                        }}
                      >
                        <RxDotsHorizontal size={20} />
                      </button>
                      <DropdownPortal
                        isOpen={openDropdownId === user.auth_id}
                        triggerRef={{
                          current: dropdownRefs.current[user.auth_id] ?? document.body,
                        }}
                      >
                        <div className="py-2 bg-white rounded-md shadow-xl border border-gray-200 w-40">
                          <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={async e => {
                              e.stopPropagation();
                              router.push(`/admin/edit-profile?user_ID=${user.auth_id}`);
                              setOpenDropdownId(null);
                            }}
                          >
                            <RxPencil1 size={18} className="mr-2 text-green-500" />
                            Update
                          </button>
                            <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={e => {
                              e.stopPropagation();
                              const confirmDelete = window.confirm(
                              'Are you sure you want to delete the user?'
                              );
                              if (confirmDelete) {
                              handleUserAction(
                                user.auth_id,
                                'Deleted the user!',
                                'Failed to delete the user',
                                toast
                              ).then(() => {
                                setOpenDropdownId(null);
                                localStorage.setItem(
                                'user-toast',
                                JSON.stringify({
                                  title: 'Success',
                                  description: 'Deleted the user!',
                                })
                                );
                                window.location.reload();
                              });
                              } else {
                              setOpenDropdownId(null);
                              }
                            }}
                            >
                            <RxTrash size={18} className="mr-2 text-red-500" />
                            Delete
                            </button>
                          <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={async e => {
                              e.stopPropagation();
                              router.push(`/admin/set-password?user_ID=${user.auth_id}`);
                              setOpenDropdownId(null);
                            }}
                          >
                            <RxLockOpen1 size={18} className="mr-2 text-gray-500" />
                            Change password
                          </button>
                        </div>
                      </DropdownPortal>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-10">
                  <div className="flex flex-col items-center justify-center text-center mt-16 text-gray-500">
                    <List className="w-12 h-12 mb-4" />
                    <p className="font-medium text-base text-gray-700">No users searched</p>
                    <p className="text-sm mt-1">
                      Input the first or last name of the user then click &quot;Search&quot; to find
                      the user.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default manageUsers;
