'use client';

import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { List } from 'lucide-react';

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

  const [hasSearched, setHasSearched] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true);

  const handleSearch = () => {
    const isInputComplete = firstName && lastName;
    setHasSearched(true);
    setShowEmptyState(!isInputComplete);
  };

  const [users] = useState<User[]>([
    { id: 1, number: '2021001', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '1234567890', role: 'Student', department: 'Computer Science' },
    { id: 2, number: '2021002', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '0987654321', role: 'Faculty', department: 'Mathematics' },
    { id: 3, number: '2021003', firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', phone: '1122334455', role: 'Staff', department: 'Physics' },
    { id: 4, number: '2021004', firstName: 'Bob', lastName: 'Brown', email: 'bob.brown@example.com', phone: '5566778899', role: 'Student', department: 'Chemistry' },
    { id: 5, number: '2021005', firstName: 'Charlie', lastName: 'Davis', email: 'charlie.davis@example.com', phone: '6677889900', role: 'Admin', department: 'Biology' },
  ]);

    return (
      <div className="bg-white p-6 md:p-10 rounded-3xl drop-shadow-[0_-4px_10px_rgba(0,0,0,0.1)] mx-4 md:mx-20 mt-1 mb-10 font-roboto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-lg md:text-2xl font-bold font-raleway text-gray-900">
            Find User
          </h2>
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
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-[#5D1A0B] text-white px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-[#731f10] transition"
          >
            <Search className="text-white" size={20} />
            <span className="hidden md:block">Search</span>
          </button>
        </div>

        {hasSearched && showEmptyState && (
        <div className="flex flex-col items-center justify-center text-center mt-16 text-gray-500">
          <List className="w-12 h-12 mb-4" />
          <p className="font-medium text-base text-gray-700">No users searched yet</p>
          <p className="text-sm mt-1">
            Input the first and last names of the user then click &quot;Search&quot; to find the user.
          </p>
        </div>
      )}

      {hasSearched && !showEmptyState && (
        <>
          <h3 className="text-xl font-semibold font-raleway mb-4 mt-10">Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden text-sm md:text-base">
              <thead>
                <tr className="bg-[#5D1A0B] text-white">
                  <th className="px-2 md:px-4 py-2 w-[20%] min-w-[150px] rounded-tl-lg">User ID</th>
                  <th className="px-2 md:px-4 py-2 w-[12%] min-w-[80px]">
                    Student
                    <br />
                    Number
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
            </table>
          </div>
        </>
      )}
      </div>
    );
};