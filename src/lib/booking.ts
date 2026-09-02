import { db } from './db';
import { TimeSlot } from '@/types';

// Helper to convert "HH:mm" to total minutes from midnight
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Helper to convert total minutes to "HH:mm"
function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Checks if two time intervals [start1, end1] and [start2, end2] overlap
 */
function isOverlapping(start1: number, end1: number, start2: number, end2: number): boolean {
  return start1 < end2 && start2 < end1;
}

/**
 * Returns available booking dates for the next 30 days
 */
export async function getAvailableDates(daysAhead: number = 30) {
  const weeklyAvailability = await db.availability.findMany();
  const blackoutDates = await db.blackoutDate.findMany();
  const blackoutSet = new Set(blackoutDates.map((b) => b.date));

  const availableDates: { date: string; formatted: string; dayName: string }[] = [];
  const today = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon ...

    const dayAvail = weeklyAvailability.find((a) => a.dayOfWeek === dayOfWeek);

    if (dayAvail && dayAvail.isOpen && !blackoutSet.has(dateStr)) {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
      availableDates.push({ date: dateStr, formatted, dayName });
    }
  }

  return availableDates;
}

/**
 * Calculates dynamic time slots for a given date, service, and preferred staff member
 */
export async function getAvailableTimeSlots(
  dateStr: string,
  serviceId: string,
  staffId?: string | null
): Promise<{ time: string; available: boolean; assignedStaffId?: string }[]> {
  const dateObj = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = dateObj.getDay();

  // 1. Check salon availability for this weekday
  const salonAvail = await db.availability.findUnique({
    where: { dayOfWeek },
  });

  if (!salonAvail || !salonAvail.isOpen) {
    return [];
  }

  // 2. Check if date is blacked out
  const blackout = await db.blackoutDate.findUnique({
    where: { date: dateStr },
  });
  if (blackout) {
    return [];
  }

  // 3. Fetch Service duration
  const service = await db.service.findUnique({
    where: { id: serviceId },
  });
  if (!service || !service.isActive) {
    return [];
  }
  const serviceDuration = service.durationMinutes;

  // 4. Find eligible staff members
  let staffList = await db.staff.findMany({
    where: {
      isAvailable: true,
      staffServices: {
        some: { serviceId },
      },
    },
  });

  if (staffId && staffId !== 'ANY') {
    staffList = staffList.filter((s) => s.id === staffId);
  }

  // Filter staff by workDays
  staffList = staffList.filter((s) => {
    const days = s.workDays.split(',').map(Number);
    return days.includes(dayOfWeek);
  });

  if (staffList.length === 0) {
    return [];
  }

  // 5. Fetch existing non-cancelled appointments for candidate staff on this date
  const staffIds = staffList.map((s) => s.id);
  const existingAppointments = await db.appointment.findMany({
    where: {
      date: dateStr,
      status: { not: 'CANCELLED' },
      staffId: { in: staffIds },
    },
  });

  // 6. Generate 30-minute increment slots within salon open/close time
  const salonOpenMins = timeToMinutes(salonAvail.openTime);
  const salonCloseMins = timeToMinutes(salonAvail.closeTime);

  const salonBreakStartMins = salonAvail.breakStartTime ? timeToMinutes(salonAvail.breakStartTime) : null;
  const salonBreakEndMins = salonAvail.breakEndTime ? timeToMinutes(salonAvail.breakEndTime) : null;

  const slots: { time: string; available: boolean; assignedStaffId?: string }[] = [];

  // Don't allow booking in the past for today's date
  const now = new Date();
  const isToday = dateStr === now.toISOString().split('T')[0];
  const currentMins = isToday ? now.getHours() * 60 + now.getMinutes() + 30 : 0;

  for (let slotMins = salonOpenMins; slotMins + serviceDuration <= salonCloseMins; slotMins += 30) {
    const timeFormatted = minutesToTime(slotMins);
    const slotEndMins = slotMins + serviceDuration;

    // Check if in the past today
    if (isToday && slotMins < currentMins) {
      slots.push({ time: timeFormatted, available: false });
      continue;
    }

    // Check salon break time overlap
    if (
      salonBreakStartMins !== null &&
      salonBreakEndMins !== null &&
      isOverlapping(slotMins, slotEndMins, salonBreakStartMins, salonBreakEndMins)
    ) {
      slots.push({ time: timeFormatted, available: false });
      continue;
    }

    // Find at least one staff member who is free during [slotMins, slotEndMins]
    let freeStaffId: string | undefined = undefined;

    for (const staff of staffList) {
      const staffStartMins = timeToMinutes(staff.startTime);
      const staffEndMins = timeToMinutes(staff.endTime);

      // Check if slot falls within staff working hours
      if (slotMins < staffStartMins || slotEndMins > staffEndMins) {
        continue;
      }

      // Check existing appointments collision
      const staffApps = existingAppointments.filter((app) => app.staffId === staff.id);
      const hasCollision = staffApps.some((app) => {
        const appStart = timeToMinutes(app.startTime);
        const appEnd = timeToMinutes(app.endTime);
        return isOverlapping(slotMins, slotEndMins, appStart, appEnd);
      });

      if (!hasCollision) {
        freeStaffId = staff.id;
        break; // found an available staff member!
      }
    }

    if (freeStaffId) {
      slots.push({ time: timeFormatted, available: true, assignedStaffId: freeStaffId });
    } else {
      slots.push({ time: timeFormatted, available: false });
    }
  }

  return slots;
}
