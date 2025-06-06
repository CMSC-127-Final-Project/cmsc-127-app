export interface User {
  auth_id: string;
  number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  dept: string;
  office: string;
  rank: string;
  student_num?: string;
  instructor_id?: string;
}

export interface ContactOptionProps {
  icon: React.ReactNode;
  title: string;
}

export interface FaqItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface Reservation {
  reservation_id: string;
  created_at: string;
  room_num: string;
  date: string;
  name: string;
  start_time: string;
  end_time: string;
  status: string;
  admin_notes: string;
}

export interface Room {
  id: string;
  number: string;
  capacity: number;
  notes?: string;
  freeSlots: { start: string; end: string }[];
}

export interface RoomSchedules {
  room_number: string;
  room_type: string;
  schedules: {
    timeslot_id: string;
    regular: boolean;
    start_time: string;
    end_time: string;
    time_range: string;
    days?: string;
    date?: string;
  }[];
}

export interface ContactOptionProps {
  icon: React.ReactNode;
  title: string;
}

export interface FaqItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface Reservation {
  reservation_id: string;
  created_at: string;
  room_num: string;
  date: string;
  name: string;
  start_time: string;
  end_time: string;
  status: string;
  admin_notes: string;
}

export interface Room {
  id: string;
  number: string;
  capacity: number;
  notes?: string;
  freeSlots: { start: string; end: string }[];
}

export interface RoomSchedules {
  room_number: string;
  room_type: string;
  schedules: {
    timeslot_id: string;
    regular: boolean;
    start_time: string;
    end_time: string;
    time_range: string;
    days?: string;
    date?: string;
  }[];
}

export interface PWAOptions {
  dest: string;
  register?: boolean;
  skipWaiting?: boolean;
  disable?: boolean;
  runtimeCaching?: Array<{
    urlPattern: RegExp | string;
    handler: string;
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
      cacheableResponse?: {
        statuses?: number[];
        headers?: Record<string, string>;
      };
    };
  }>;
  buildExcludes?: string[];
}
