'use client';

import React from 'react';

const Users = () => {
    return (
      <div className="bg-white p-6 md:p-10 rounded-3xl drop-shadow-[0_-4px_10px_rgba(0,0,0,0.1)] mx-4 md:mx-20 mt-1 mb-10">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-lg md:text-2xl font-bold font-raleway">Users</h2>
        </div>
  
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
                <th className="px-2 md:px-4 py-2 w-[15%] min-w-[110px]">Name</th>
                <th className="px-2 md:px-4 py-2 w-[10%] min-w-[70px]">Email</th>
                <th className="px-2 md:px-4 py-2 w-[12%] min-w-[90px]">Phone</th>
                <th className="px-2 md:px-4 py-2 w-[12%] min-w-[90px]">Role</th>
                <th className="px-2 md:px-4 py-2 w-[10%] min-w-[80px]">Department</th>
                <th className="px-2 md:px-4 py-2 w-[10%] min-w-[80px] rounded-tr-lg">Actions</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    );
};
  
export default Users;