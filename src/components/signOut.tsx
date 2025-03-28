'use client';
import { useState } from 'react';

export default function SignOutPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!showPopup ? (
        <button
          onClick={() => setShowPopup(true)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Sign Out
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Sign Out</h1>
          <p className="mb-4">Are you sure you want to sign out?</p>
          <button
            onClick={() => setShowPopup(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition mr-2"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
