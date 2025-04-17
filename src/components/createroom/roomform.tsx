"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function RoomForm() {
  const { toast } = useToast();
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [roomType, setRoomType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName || !capacity || !roomType) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const existingRooms = JSON.parse(localStorage.getItem("rooms") || "[]");

    const newRoom = {
      id: Date.now(),
      name: roomName,
      capacity: Number.parseInt(capacity),
      type: roomType,
      createdAt: new Date().toISOString(),
    };

    const updatedRooms = [...existingRooms, newRoom];
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));

    setRoomName("");
    setCapacity("");
    setRoomType("");

    toast({
      title: "Success",
      description: "Room added successfully",
    });

    window.dispatchEvent(new Event("roomsUpdated"));
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md w-full font-roboto">
      <div className="mb-6">
        <h2 className="text-lg md:text-2xl font-bold font-raleway text-gray-900">
          Add New Room
        </h2>
        <p className="text-sm text-gray-600 font-raleway">
          Enter the details for a new room
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 font-roboto">
        <div className="space-y-2">
          <Label htmlFor="room-name" className="font-roboto">
            Room Name
          </Label>
          <Input
            id="room-name"
            placeholder="e.g. Room 201"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="font-roboto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity" className="font-roboto">
            Capacity
          </Label>
          <Input
            id="capacity"
            type="number"
            placeholder="e.g. 30"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="font-roboto"
          />
        </div>

        <div className="space-y-2 font-roboto">
          <Label htmlFor="room-type" className="font-roboto">
            Room Type
          </Label>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger id="room-type">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classroom">Classroom</SelectItem>
              <SelectItem value="laboratory">Laboratory</SelectItem>
              <SelectItem value="conference-room">Conference Room</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#5D1A0B] hover:bg-[#731f10] text-white rounded-2xl font-raleway"
        >
          Add Room
        </Button>
      </form>
    </div>
  );
}
