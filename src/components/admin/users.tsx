'use client';

import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, List } from 'lucide-react';
import { RxDotsHorizontal, RxPencil1, RxTrash, RxLockOpen1 } from 'react-icons/rx';

interface User {
  id: number;
  number: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
}

export default function Users() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState<User[]>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/usersList');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch users');
        }

        // Map the API response to match the User interface
        const mappedUsers = data.map((user: any) => ({
          number: user.student_num || user.instructor_id || 'N/A',
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          department: user.dept,
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

  const handleClickOutside = useCallback(() => {
    if (openDropdownId) setOpenDropdownId(null);
  }, [openDropdownId]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  const handleClearSearch = () => {
    setFirstName('');
    setLastName('');
    setHasSearched(false);
    setFilteredUsers(users);
    setShowEmptyState(false);
  };

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

      <h3 className="text-xl font-semibold font-raleway mb-4 mt-10">Users</h3>
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
          <tbody>
            {hasSearched && showEmptyState && (
              <tr>
                <td colSpan={9} className="py-10">
                  <div className="flex flex-col items-center justify-center text-center mt-16 text-gray-500">
                    <List className="w-12 h-12 mb-4" />
                    <p className="font-medium text-base text-gray-700">No users searched yet</p>
                    <p className="text-sm mt-1">
                      Input the first or last name of the user then click &quot;Search&quot; to find
                      the user.
                    </p>
                  </div>
                </td>
              </tr>
            )}
            {filteredUsers?.map(user => (
              <tr key={user.id} className="border-t last:border-b">
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                  {user.number}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                  {user.firstName}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                  {user.lastName}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                  {user.email}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                  {user.phone}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                  {user.role}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                  {user.department}
                </td>
                <td className="px-0 md:px-0 py-5 relative text-center">
                  <button
                    className="text-gray-500 px-2 py-1 rounded-md"
                    onClick={e => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === user.id ? null : user.id);
                    }}
                  >
                    <RxDotsHorizontal size={20} />
                  </button>

                  {openDropdownId === user.id && (
                    <div
                      className="absolute right-0 mt-2 py-2 bg-white rounded-md shadow-xl z-50 border border-gray-200"
                      style={{ position: 'absolute', top: '100%', right: '0' }}
                    >
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={e => {
                          e.stopPropagation();
                          setOpenDropdownId(null);
                        }}
                      >
                        <RxPencil1 size={18} className="mr-2 text-gray-500" />
                        Update
                      </button>

                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={e => {
                          e.stopPropagation();
                          setOpenDropdownId(null);
                        }}
                      >
                        <RxTrash size={18} className="mr-2 text-gray-500" />
                        Delete
                      </button>

                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={e => {
                          e.stopPropagation();
                          setOpenDropdownId(null);
                        }}
                      >
                        <RxLockOpen1 size={18} className="mr-2 text-gray-500" />
                        Change password
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
