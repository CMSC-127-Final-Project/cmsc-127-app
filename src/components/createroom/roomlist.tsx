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
  name: string;
  capacity: number;
  type: string;
  createdAt: string;
};

type ActionMode = 'edit' | 'delete' | null;

export function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [actionMode, setActionMode] = useState<ActionMode>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [editedRoom, setEditedRoom] = useState<Room | null>(null);

  const loadRooms = () => {
    const storedRooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    setRooms(storedRooms);
  };

  useEffect(() => {
    loadRooms();
    window.addEventListener('roomsUpdated', loadRooms);
    return () => window.removeEventListener('roomsUpdated', loadRooms);
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

  const saveRoom = () => {
    if (!editedRoom) return;
    const updatedRooms = rooms.map(room => (room.id === editedRoom.id ? editedRoom : room));
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    setRooms(updatedRooms);
    closeEditModal();
  };

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md w-full font-roboto relative">
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
              <TableRow>
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
                <TableRow>
                  <TableCell
                    colSpan={actionMode ? 4 : 3}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No rooms added yet. Use the form to add one.
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map(room => (
                  <TableRow key={room.id} className="hover:bg-[#fdf7f6]">
                    <TableCell className="font-medium text-gray-800 font-roboto">
                      {room.name}
                    </TableCell>
                    <TableCell className="text-gray-700 font-roboto">{room.capacity}</TableCell>
                    <TableCell className="text-gray-700 font-roboto">
                      {formatRoomType(room.type)}
                    </TableCell>
                    {actionMode === 'delete' && (
                      <TableCell className="text-center text-red-500">
                        <Trash2 className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
                      </TableCell>
                    )}
                    {actionMode === 'edit' && (
                      <TableCell className="text-center text-blue-500">
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
                  value={editedRoom.name}
                  onChange={e => setEditedRoom({ ...editedRoom, name: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <input
                  type="number"
                  value={editedRoom.capacity}
                  onChange={e =>
                    setEditedRoom({
                      ...editedRoom,
                      capacity: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Type</label>
                <input
                  type="text"
                  value={editedRoom.type}
                  onChange={e => setEditedRoom({ ...editedRoom, type: e.target.value })}
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

"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Pencil, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

type Room = {
  id: number;
  name: string;
  capacity: number;
  type: string;
  createdAt: string;
};

type ActionMode = "edit" | "delete" | null;

export function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [actionMode, setActionMode] = useState<ActionMode>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [editedRoom, setEditedRoom] = useState<Room | null>(null);

  const loadRooms = () => {
    const storedRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    setRooms(storedRooms);
  };

  useEffect(() => {
    loadRooms();
    window.addEventListener("roomsUpdated", loadRooms);
    return () => window.removeEventListener("roomsUpdated", loadRooms);
  }, []);

  const formatRoomType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const toggleMode = (mode: ActionMode) => {
    setActionMode((prev) => (prev === mode ? null : mode));
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

  const saveRoom = () => {
    if (!editedRoom) return;
    const updatedRooms = rooms.map((room) =>
      room.id === editedRoom.id ? editedRoom : room
    );
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    setRooms(updatedRooms);
    closeEditModal();
  };

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md w-full font-roboto relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg md:text-2xl font-bold font-raleway text-gray-900">
              Room List
            </h2>
            <p className="text-sm text-gray-600">View all available rooms</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={actionMode === "delete" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => toggleMode("delete")}
              className="border border-red-600 text-red-600 px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-red-50 transition"
            >
              <X className="w-5 h-5" />
            </Button>
            <Button
              variant={actionMode === "edit" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => toggleMode("edit")}
              className="bg-[#5D1A0B] text-white px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-[#731f10] transition"
            >
              <Edit className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#5D1A0B]">
              <TableRow>
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
                <TableRow>
                  <TableCell
                    colSpan={actionMode ? 4 : 3}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No rooms added yet. Use the form to add one.
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow key={room.id} className="hover:bg-[#fdf7f6]">
                    <TableCell className="font-medium text-gray-800 font-roboto">
                      {room.name}
                    </TableCell>
                    <TableCell className="text-gray-700 font-roboto">
                      {room.capacity}
                    </TableCell>
                    <TableCell className="text-gray-700 font-roboto">
                      {formatRoomType(room.type)}
                    </TableCell>
                    {actionMode === "delete" && (
                      <TableCell className="text-center text-red-500">
                        <Trash2 className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
                      </TableCell>
                    )}
                    {actionMode === "edit" && (
                      <TableCell className="text-center text-blue-500">
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
            <h3 className="text-xl font-semibold text-gray-800">
              Edit Room
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Name
                </label>
                <input
                  type="text"
                  value={editedRoom.name}
                  onChange={(e) =>
                    setEditedRoom({ ...editedRoom, name: e.target.value })
                  }
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  value={editedRoom.capacity}
                  onChange={(e) =>
                    setEditedRoom({
                      ...editedRoom,
                      capacity: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Type
                </label>
                <input
                  type="text"
                  value={editedRoom.type}
                  onChange={(e) =>
                    setEditedRoom({ ...editedRoom, type: e.target.value })
                  }
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
