'use client';

import { useRouter } from 'next/navigation';
import { RxPencil1, RxTrash, RxLockOpen1 } from 'react-icons/rx';

interface UserActionsDropdownProps {
  authId: string;
  onDelete: (authId: string) => void;
  onClose: () => void;
}

export default function UserActionsDropdown({ authId, onDelete, onClose }: UserActionsDropdownProps) {
  const router = useRouter();

  return (
    <div
      className="absolute right-0 mt-2 py-2 bg-white rounded-md shadow-xl z-50 border border-gray-200"
      style={{ position: 'absolute', top: '100%', right: '0' }}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <button
        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        onClick={() => {
          router.push(`/admin/edit-profile?user_ID=${authId}`);
          onClose();
        }}
      >
        <RxPencil1 size={18} className="mr-2 text-gray-500" />
        Update
      </button>

      <button
        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        onClick={() => {
          onDelete(authId);
          onClose();
        }}
      >
        <RxTrash size={18} className="mr-2 text-gray-500" />
        Delete
      </button>

      <button
        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        onClick={onClose}
      >
        <RxLockOpen1 size={18} className="mr-2 text-gray-500" />
        Change password
      </button>
    </div>
  );
}