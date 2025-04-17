'use client';

import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface CalendarProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  placeholderText?: string;
  minDate?: Date;
  maxDate?: Date;
}

function Calendar({
  selected,
  onChange,
  className,
  placeholderText = 'Select date',
  minDate,
  maxDate,
}: CalendarProps) {
  return (
    <div className={cn('relative', className)}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        dateFormat="MMMM d, yyyy"
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'w-full text-left cursor-pointer'
        )}
        minDate={minDate}
        maxDate={maxDate}
        calendarClassName="z-50 rounded-md shadow-md"
        popperPlacement="bottom-start"
      />
    </div>
  );
}

export { Calendar };
