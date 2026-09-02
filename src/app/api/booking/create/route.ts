import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAvailableTimeSlots } from '@/lib/booking';

function generateAppointmentCode(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `AUR-${randomNum}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serviceId, staffId, date, startTime, customerName, customerPhone, customerEmail, notes } = body;

    // 1. Basic validation
    if (!serviceId || !date || !startTime || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required booking details (service, date, time, name, phone).' },
        { status: 400 }
      );
    }

    const cleanPhone = customerPhone.trim().replace(/[^\d+]/g, '');
    if (cleanPhone.length < 7) {
      return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
    }

    // 2. Service check
    const service = await db.service.findUnique({
      where: { id: serviceId },
    });
    if (!service || !service.isActive) {
      return NextResponse.json({ error: 'Selected service is no longer available.' }, { status: 404 });
    }

    // 3. Double-booking check: Verify slot availability
    const slots = await getAvailableTimeSlots(date, serviceId, staffId);
    const chosenSlot = slots.find((s) => s.time === startTime && s.available);

    if (!chosenSlot) {
      return NextResponse.json(
        { error: 'Selected time slot is no longer available. Please select another slot.' },
        { status: 409 }
      );
    }

    // Determine final staff member
    let finalStaffId = chosenSlot.assignedStaffId;
    if (staffId && staffId !== 'ANY') {
      finalStaffId = staffId;
    }

    if (!finalStaffId) {
      return NextResponse.json({ error: 'No available specialist for this slot.' }, { status: 400 });
    }

    // Calculate end time
    const [h, m] = startTime.split(':').map(Number);
    const totalStartMins = h * 60 + m;
    const totalEndMins = totalStartMins + service.durationMinutes;
    const endH = Math.floor(totalEndMins / 60);
    const endM = totalEndMins % 60;
    const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

    // 4. Find or create Customer
    let customer = await db.customer.findUnique({
      where: { phone: cleanPhone },
    });

    if (!customer) {
      customer = await db.customer.create({
        data: {
          name: customerName.trim(),
          phone: cleanPhone,
          email: customerEmail ? customerEmail.trim() : null,
          notes: notes ? notes.trim() : null,
        },
      });
    } else {
      // Update customer info if needed
      customer = await db.customer.update({
        where: { id: customer.id },
        data: {
          name: customerName.trim(),
          email: customerEmail ? customerEmail.trim() : customer.email,
        },
      });
    }

    // 5. Generate code and create Appointment
    let code = generateAppointmentCode();
    let isUnique = false;
    while (!isUnique) {
      const existing = await db.appointment.findUnique({ where: { appointmentCode: code } });
      if (!existing) isUnique = true;
      else code = generateAppointmentCode();
    }

    const appointment = await db.appointment.create({
      data: {
        appointmentCode: code,
        customerId: customer.id,
        serviceId: service.id,
        staffId: finalStaffId,
        date,
        startTime,
        endTime,
        price: service.price,
        status: 'CONFIRMED',
        notes: notes ? notes.trim() : null,
      },
      include: {
        customer: true,
        service: true,
        staff: true,
      },
    });

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json({ error: 'Failed to complete appointment booking.' }, { status: 500 });
  }
}
