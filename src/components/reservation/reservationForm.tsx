"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function ReservationForm() {
  const [allDay, setAllDay] = useState(false)

  return(
    <form className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label htmlFor="room-number" className="font-medium">
            Room Number
          </label>
          <Input id="room-number" className="border-[#6b2323]/20 focus-visible:ring-[#6b2323]" />
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="font-medium">
            Date
          </label>
          <Input id="date" type="date" className="border-[#6b2323]/20 focus-visible:ring-[#6b2323]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="font-medium">Time</label>
          <div className="flex items-center gap-2">
            <Input type="time" className="border-[#6b2323]/20 focus-visible:ring-[#6b2323]" />
            <span className="px-2">—</span>
            <Input type="time" className="border-[#6b2323]/20 focus-visible:ring-[#6b2323]" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="all-day"
              checked={allDay}
              onCheckedChange={(checked) => setAllDay(checked as boolean)}
              className="border-[#6b2323]/20 data-[state=checked]:bg-[#6b2323] data-[state=checked]:border-[#6b2323]"
            />
            <label htmlFor="all-day" className="text-sm cursor-pointer">
              All day
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="reason" className="font-medium">
            Reason
          </label>
          <Select>
            <SelectTrigger className="border-[#6b2323]/20 focus:ring-[#6b2323]">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="class">Class</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="study">Study Group</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="font-medium">
          Message
        </label>
        <Textarea id="message" rows={8} className="border-[#6b2323]/20 focus-visible:ring-[#6b2323]" />
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-[#6b2323] hover:bg-[#5a1e1e] px-8">
          Submit
        </Button>
      </div>
    </form>
  )  
}