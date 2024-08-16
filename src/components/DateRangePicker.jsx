import React, { useState } from 'react';
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format, subYears, isAfter, isBefore, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
  const today = startOfDay(new Date());
  const threeYearsAgo = subYears(today, 3);
  
  const [tempStartDate, setTempStartDate] = useState(startDate ? new Date(startDate) : null);
  const [tempEndDate, setTempEndDate] = useState(endDate ? new Date(endDate) : null);

  const years = Array.from({length: 4}, (_, i) => today.getFullYear() - i);
  const months = Array.from({length: 12}, (_, i) => i + 1);
  const days = Array.from({length: 31}, (_, i) => i + 1);

  const handleDateChange = (type, field, value) => {
    const currentDate = field === 'start' ? tempStartDate || threeYearsAgo : tempEndDate || today;
    let newDate = new Date(currentDate);

    if (type === 'year') newDate.setFullYear(value);
    if (type === 'month') newDate.setMonth(value - 1);
    if (type === 'day') newDate.setDate(value);

    if (isBefore(newDate, threeYearsAgo)) newDate = threeYearsAgo;
    if (isAfter(newDate, today)) newDate = today;

    if (field === 'start') {
      setTempStartDate(newDate);
      if (tempEndDate && isBefore(tempEndDate, newDate)) {
        setTempEndDate(newDate);
      }
    } else {
      setTempEndDate(newDate);
      if (tempStartDate && isAfter(tempStartDate, newDate)) {
        setTempStartDate(newDate);
      }
    }
  };

  const handleApply = (field) => {
    const date = field === 'start' ? tempStartDate : tempEndDate;
    onDateChange({ 
      startDate: field === 'start' ? format(date, 'yyyy-MM-dd') : startDate, 
      endDate: field === 'end' ? format(date, 'yyyy-MM-dd') : endDate 
    });
  };

  const renderDatePicker = (field, date, minDate, maxDate) => (
    <div className="flex flex-col space-y-2">
      <Select onValueChange={(value) => handleDateChange('year', field, parseInt(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map(year => (
            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleDateChange('month', field, parseInt(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map(month => (
            <SelectItem key={month} value={month.toString()}>{format(new Date(2000, month - 1), 'MMMM')}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleDateChange('day', field, parseInt(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {days.map(day => (
            <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={() => handleApply(field)}>Apply</Button>
    </div>
  );

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="startDate" className="text-lg font-semibold">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(new Date(startDate), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {renderDatePicker('start', tempStartDate, threeYearsAgo, tempEndDate || today)}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="endDate" className="text-lg font-semibold">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(new Date(endDate), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {renderDatePicker('end', tempEndDate, tempStartDate || threeYearsAgo, today)}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangePicker;