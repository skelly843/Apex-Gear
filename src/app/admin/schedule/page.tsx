'use client';

import { useState, useEffect } from 'react';
import { DayPicker, DayModifiers } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, startOfMonth } from 'date-fns';

type Zone = { id: number; name: string };
type Assignment = {
  date: string;
  zone_id: number | null;
  working_start_time: string;
  working_end_time: string;
  is_closed: boolean;
  allow_mixed: boolean;
  zones?: { name: string };
};

export default function ScheduleAdminPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAssignment, setSelectedAssignment] = useState<Partial<Assignment>>({
    zone_id: null,
    working_start_time: '09:00',
    working_end_time: '17:00',
    is_closed: false,
    allow_mixed: false,
  });

  const fetchZones = async () => {
    const response = await fetch('/api/admin/zones');
    const data = await response.json();
    setZones(data);
  };

  const fetchSchedule = async (month: Date) => {
    const monthString = format(month, 'yyyy-MM');
    const response = await fetch(`/api/admin/schedule?month=${monthString}`);
    const data: Assignment[] = await response.json();
    const assignmentsMap = data.reduce((acc, assign) => {
      acc[assign.date] = assign;
      return acc;
    }, {} as Record<string, Assignment>);
    setAssignments(assignmentsMap);
  };

  useEffect(() => {
    fetchZones();
    fetchSchedule(currentMonth);
  }, [currentMonth]);

  useEffect(() => {
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const assignmentForDay = assignments[dateString];
      setSelectedAssignment(
        assignmentForDay || {
          date: dateString,
          zone_id: null,
          working_start_time: '09:00',
          working_end_time: '17:00',
          is_closed: false,
          allow_mixed: false,
        }
      );
    }
  }, [selectedDate, assignments]);

  const handleSave = async () => {
    const response = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedAssignment, date: format(selectedDate!, 'yyyy-MM-dd') }),
    });
    if (response.ok) {
        fetchSchedule(currentMonth);
    } else {
        alert('Failed to save schedule');
    }
  };

  const DayContent = ({ date }: { date: Date }) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const assignment = assignments[dateString];
    if (!assignment || assignment.is_closed) return <div className="text-center">{date.getDate()}</div>;
    return (
      <div className="text-center">
        <div>{date.getDate()}</div>
        <div className="text-xs text-blue-600">{assignment.zones?.name || 'Mixed'}</div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Schedule</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            components={{ DayContent: DayContent as any }}
            className="border rounded-lg p-4"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            Schedule for {selectedDate ? format(selectedDate, 'PPP') : '...'}
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="zone_id" className="block text-sm font-medium">Zone</label>
              <select
                id="zone_id"
                name="zone_id"
                value={selectedAssignment.zone_id || ''}
                onChange={(e) => setSelectedAssignment(prev => ({...prev, zone_id: Number(e.target.value) || null}))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md">
                <option value="">Select a zone</option>
                {zones.map(zone => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium">Working Hours</label>
              <div className="flex items-center space-x-2 mt-1">
                <input type="time" id="start_time" name="working_start_time" value={selectedAssignment.working_start_time} onChange={(e) => setSelectedAssignment(prev => ({...prev, working_start_time: e.target.value}))} className="w-full border-gray-300 rounded-md shadow-sm" />
                <span>to</span>
                <input type="time" id="end_time" name="working_end_time" value={selectedAssignment.working_end_time} onChange={(e) => setSelectedAssignment(prev => ({...prev, working_end_time: e.target.value}))} className="w-full border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
            <div className="flex items-start">
              <input id="is_closed" name="is_closed" type="checkbox" checked={selectedAssignment.is_closed} onChange={(e) => setSelectedAssignment(prev => ({...prev, is_closed: e.target.checked}))} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <label htmlFor="is_closed" className="ml-3 font-medium text-gray-700">Mark as Closed</label>
            </div>
             <div className="flex items-start">
              <input id="allow_mixed" name="allow_mixed" type="checkbox" checked={selectedAssignment.allow_mixed} onChange={(e) => setSelectedAssignment(prev => ({...prev, allow_mixed: e.target.checked}))} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <label htmlFor="allow_mixed" className="ml-3 font-medium text-gray-700">Allow Mixed/Open Zone</label>
            </div>
            <button onClick={handleSave} className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
