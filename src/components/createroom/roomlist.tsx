'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Pencil, X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Room = {
  id: number;
  room_number: string;
  capacity: number;
  room_type: string;
  status: string;
  created_at: string;
};

type ActionMode = 'edit' | 'delete' | null;

export function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [actionMode, setActionMode] = useState<ActionMode>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [editedRoom, setEditedRoom] = useState<Room | null>(null);

  const loadRooms = async () => {
    try {
      const res = await fetch('/api/rooms/getRooms');
      const result = await res.json();
      if (res.ok) {
        setRooms(result.data);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const handleDelete = async (roomNumber: string) => {
    try {
      const res = await fetch('/api/rooms/deleteRoom', {
        method: 'PATCH', // <-- Change this from DELETE to PATCH
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_number: roomNumber,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to delete room: ${res.status}`);
      }

      await loadRooms();
    } catch (error) {
      console.error('Error in handleDelete:', error);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const formatRoomType = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toggleMode = (mode: ActionMode) => {
    setActionMode(prev => (prev === mode ? null : mode));
    setSelectedRoom(null);
  };

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setEditedRoom({ ...room });
  };

  const closeEditModal = () => {
    setSelectedRoom(null);
    setEditedRoom(null);
  };

  const saveRoom = async () => {
    if (!editedRoom) return;

    try {
      const res = await fetch('/api/reservations/editRoom', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_room_number: selectedRoom?.room_number,
          room_number: editedRoom.room_number,
          capacity: editedRoom.capacity,
          room_type: editedRoom.room_type,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update room');
      }

      await loadRooms();
      closeEditModal();
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md w-full font-roboto relative mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg md:text-2xl font-bold font-raleway text-gray-900">Room List</h2>
            <p className="text-sm text-gray-600">View all available rooms</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={actionMode === 'delete' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => toggleMode('delete')}
              className="border border-red-600 text-red-600 px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-red-50 transition"
            >
              <X className="w-5 h-5" />
            </Button>
            <Button
              variant={actionMode === 'edit' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => toggleMode('edit')}
              className="bg-[#5D1A0B] text-white px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-[#731f10] transition"
            >
              <Edit className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#5D1A0B]">
              <TableRow className="hover:bg-[#5D1A0B]">
                <TableHead className="font-semibold text-sm text-white font-roboto">
                  Room Name
                </TableHead>
                <TableHead className="font-semibold text-sm text-white font-roboto">
                  Capacity
                </TableHead>
                <TableHead className="font-semibold text-sm text-white font-roboto">
                  Room Type
                </TableHead>
                {actionMode && (
                  <TableHead className="font-semibold text-sm text-white text-center w-12 font-roboto">
                    Action
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.length === 0 ? (
                <TableRow key="empty-row">
                  <TableCell
                    colSpan={actionMode ? 4 : 3}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No rooms added yet. Use the form to add one.
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map(room => (
                  <TableRow key={`room-${room.room_number}`} className="hover:bg-[#fdf7f6]">
                    <TableCell className="font-medium text-gray-800 font-roboto">
                      {room.room_number}
                    </TableCell>
                    <TableCell className="text-gray-700 font-roboto">{room.capacity}</TableCell>
                    <TableCell className="text-gray-700 font-roboto">
                      {formatRoomType(room.room_type)}
                    </TableCell>
                    {actionMode === 'delete' && (
                      <TableCell className="text-center text-red-500">
                        <Trash2
                          className="w-5 h-5 cursor-pointer hover:scale-110 transition"
                          onClick={() => handleDelete(room.room_number)}
                        />
                      </TableCell>
                    )}
                    {actionMode === 'edit' && (
                      <TableCell
                        key={`edit-${room.room_number}`}
                        className="text-center text-blue-500"
                      >
                        <Pencil
                          className="w-5 h-5 cursor-pointer hover:scale-110 transition"
                          onClick={() => openEditModal(room)}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      {selectedRoom && editedRoom && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Edit Room</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Name</label>
                <input
                  type="text"
                  value={editedRoom.room_number}
                  onChange={e => setEditedRoom({ ...editedRoom, room_number: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <input
                  type="number"
                  value={editedRoom.capacity ?? ''}
                  onChange={e =>
                    setEditedRoom({
                      ...editedRoom,
                      capacity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Type</label>
                <input
                  type="text"
                  value={editedRoom.room_type}
                  onChange={e => setEditedRoom({ ...editedRoom, room_type: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="ghost"
                onClick={closeEditModal}
                className="border border-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={saveRoom}
                className="bg-[#5D1A0B] hover:bg-[#731f10] text-white px-4 py-2 rounded-lg"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
