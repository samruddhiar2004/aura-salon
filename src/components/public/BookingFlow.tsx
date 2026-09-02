'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  Phone,
  MessageSquare,
  AlertCircle,
  Scissors,
  ArrowRight,
} from 'lucide-react';
import { ServiceItem, StaffItem, TimeSlot } from '@/types';
import { siteConfig } from '@/lib/config';
import { getAppointmentConfirmationWhatsAppLink } from '@/lib/whatsapp';

export function BookingFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const preselectedServiceId = searchParams.get('service');

  // Step state (1 to 6)
  const [step, setStep] = useState<number>(1);

  // Data states
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [availableDates, setAvailableDates] = useState<{ date: string; formatted: string; dayName: string }[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Selection states
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffItem | null>(null); // null = Any
  const [isAnyStaff, setIsAnyStaff] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Customer Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Fetch initial services & categories
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [resServices, resDates] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/booking/dates'),
        ]);

        const dataServices = await resServices.json();
        const dataDates = await resDates.json();

        setServices(dataServices.services || []);
        setCategories(dataServices.categories || []);
        setAvailableDates(dataDates.dates || []);

        // Pre-select service if passed in query param
        if (preselectedServiceId && dataServices.services) {
          const match = dataServices.services.find((s: ServiceItem) => s.id === preselectedServiceId);
          if (match) {
            setSelectedService(match);
            setStep(2);
          }
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load services. Please refresh.');
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [preselectedServiceId]);

  // Fetch staff available for selected service
  useEffect(() => {
    if (!selectedService) return;
    const sId = selectedService.id;

    async function loadStaff() {
      try {
        const res = await fetch(`/api/staff?serviceId=${sId}`);
        const data = await res.json();
        setStaffList(data.staff || []);
      } catch (err) {
        console.error('Error fetching staff:', err);
      }
    }
    loadStaff();
  }, [selectedService]);

  // Fetch available slots when Date + Service + Staff selection changes
  useEffect(() => {
    if (!selectedService || !selectedDate) return;
    const sId = selectedService.id;

    async function loadSlots() {
      try {
        setSlotsLoading(true);
        setSelectedTime(''); // reset slot choice
        const staffParam = isAnyStaff ? 'ANY' : selectedStaff?.id || 'ANY';
        const res = await fetch(
          `/api/booking/slots?date=${selectedDate}&serviceId=${sId}&staffId=${staffParam}`
        );
        const data = await res.json();
        setAvailableSlots(data.slots || []);
      } catch (err) {
        console.error('Error loading slots:', err);
      } finally {
        setSlotsLoading(false);
      }
    }

    loadSlots();
  }, [selectedDate, selectedService, selectedStaff, isAnyStaff]);

  // Handle final submit
  async function handleConfirmBooking() {
    setErrorMsg('');
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/[^\d]/g, '').length < 7) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-[#1C1917]': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService?.id,
          staffId: isAnyStaff ? 'ANY' : selectedStaff?.id,
          date: selectedDate,
          startTime: selectedTime,
          customerName,
          customerPhone,
          customerEmail,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Failed to complete booking. Please try another slot.');
        return;
      }

      setConfirmedBooking(data.appointment);
      setStep(6); // Success Step
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Filtered services
  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'ALL') return true;
    return s.categoryId === selectedCategory;
  });

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#B8976C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-[#78716C]">Loading Atelier booking schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step Indicator Header (Steps 1-5) */}
      {step < 6 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-medium text-[#78716C] mb-3">
            <span>
              STEP {step} OF 5: {step === 1 ? 'Select Service' : step === 2 ? 'Choose Specialist' : step === 3 ? 'Choose Date' : step === 4 ? 'Select Time' : 'Your Details'}
            </span>
            <span>{Math.round((step / 5) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-[#E8DEC9] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#B8976C] h-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* STEP 1: SELECT SERVICE */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
              Select Your Ritual
            </h1>
            <p className="text-sm text-[#78716C] mt-1">
              Choose from our signature salon services and artisanal treatments.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-[#1C1917] text-[#FAFAF7]'
                  : 'bg-[#F4EFE6] text-[#44403C] hover:bg-[#E8DEC9]'
              }`}
            >
              All Treatments
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#1C1917] text-[#FAFAF7]'
                    : 'bg-[#F4EFE6] text-[#44403C] hover:bg-[#E8DEC9]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Services List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  setSelectedService(service);
                  setStep(2);
                }}
                className={`group cursor-pointer p-5 bg-white rounded-2xl border transition-all duration-200 hover:border-[#B8976C] hover:shadow-elevated flex flex-col justify-between ${
                  selectedService?.id === service.id
                    ? 'border-[#B8976C] ring-2 ring-[#B8976C]/20 bg-amber-50/20'
                    : 'border-[#E8DEC9]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg font-bold text-[#1C1917] group-hover:text-[#B8976C] transition-colors">
                      {service.name}
                    </h3>
                    <span className="font-serif text-base font-semibold text-[#B8976C]">
                      ${service.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C] leading-relaxed line-clamp-2 mb-4">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#FAFAF7] text-xs text-[#44403C]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#B8976C]" />
                    {service.durationMinutes} mins
                  </span>
                  <span className="font-semibold text-[#1C1917] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Select</span>
                    <ArrowRight className="w-3 h-3 text-[#B8976C]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: SELECT STAFF */}
      {step === 2 && selectedService && (
        <div className="space-y-6">
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Services</span>
          </button>

          <div>
            <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
              Choose Your Specialist
            </h1>
            <p className="text-sm text-[#78716C] mt-1">
              Select a preferred master stylist for your <span className="font-semibold text-[#1C1917]">{selectedService.name}</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Any Available Option */}
            <div
              onClick={() => {
                setIsAnyStaff(true);
                setSelectedStaff(null);
                setStep(3);
              }}
              className={`cursor-pointer p-5 bg-white rounded-2xl border transition-all duration-200 hover:border-[#B8976C] flex items-center space-x-4 ${
                isAnyStaff ? 'border-[#B8976C] ring-2 ring-[#B8976C]/20 bg-amber-50/10' : 'border-[#E8DEC9]'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#1C1917] text-[#FAFAF7] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#B8976C]" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#1C1917]">Any Available Specialist</h3>
                <p className="text-xs text-[#78716C] mt-0.5">Recommended for maximum date & time flexibility</p>
              </div>
            </div>

            {/* Individual Staff Cards */}
            {staffList.map((staff) => (
              <div
                key={staff.id}
                onClick={() => {
                  setIsAnyStaff(false);
                  setSelectedStaff(staff);
                  setStep(3);
                }}
                className={`cursor-pointer p-5 bg-white rounded-2xl border transition-all duration-200 hover:border-[#B8976C] flex items-center space-x-4 ${
                  !isAnyStaff && selectedStaff?.id === staff.id
                    ? 'border-[#B8976C] ring-2 ring-[#B8976C]/20 bg-amber-50/10'
                    : 'border-[#E8DEC9]'
                }`}
              >
                {staff.image ? (
                  <img
                    src={staff.image}
                    alt={staff.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#E8DEC9] shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#E8DEC9] text-[#1C1917] flex items-center justify-center shrink-0 font-serif font-bold">
                    {staff.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1C1917]">{staff.name}</h3>
                  <p className="text-xs text-[#B8976C] font-medium">{staff.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: SELECT DATE */}
      {step === 3 && (
        <div className="space-y-6">
          <button
            onClick={() => setStep(2)}
            className="inline-flex items-center text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Specialist</span>
          </button>

          <div>
            <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
              Select Preferred Date
            </h1>
            <p className="text-sm text-[#78716C] mt-1">
              Showing valid salon availability for the next 30 days.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {availableDates.map((item) => (
              <button
                key={item.date}
                onClick={() => {
                  setSelectedDate(item.date);
                  setStep(4);
                }}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedDate === item.date
                    ? 'border-[#B8976C] bg-[#1C1917] text-[#FAFAF7] shadow-soft'
                    : 'border-[#E8DEC9] bg-white text-[#1C1917] hover:border-[#B8976C]'
                }`}
              >
                <div className="text-xs uppercase tracking-wider font-semibold text-[#B8976C]">
                  {item.dayName}
                </div>
                <div className="text-lg font-serif font-bold mt-1">
                  {item.formatted.split(',')[1]}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: SELECT TIME SLOT */}
      {step === 4 && (
        <div className="space-y-6">
          <button
            onClick={() => setStep(3)}
            className="inline-flex items-center text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Date Selection</span>
          </button>

          <div>
            <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
              Select Available Time
            </h1>
            <p className="text-sm text-[#78716C] mt-1">
              Available slots for <span className="font-semibold text-[#1C1917]">{selectedDate}</span> ({selectedService?.durationMinutes} mins).
            </p>
          </div>

          {slotsLoading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="w-8 h-8 border-3 border-[#B8976C] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="p-8 bg-amber-50/50 border border-amber-200 rounded-2xl text-center">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <h3 className="font-serif text-base font-bold text-[#1C1917]">No Slots Available</h3>
              <p className="text-xs text-[#78716C] mt-1">
                All time slots for this date are fully booked or closed. Please select another date.
              </p>
              <button
                onClick={() => setStep(3)}
                className="mt-4 px-4 py-2 bg-[#1C1917] text-white text-xs font-medium rounded-full"
              >
                Choose Another Date
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => {
                    if (slot.available) {
                      setSelectedTime(slot.time);
                      setStep(5);
                    }
                  }}
                  className={`py-3 px-2 rounded-xl text-center font-medium text-sm transition-all ${
                    !slot.available
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 line-through'
                      : selectedTime === slot.time
                      ? 'bg-[#1C1917] text-[#FAFAF7] border border-[#1C1917] ring-2 ring-[#B8976C]'
                      : 'bg-white text-[#1C1917] border border-[#E8DEC9] hover:border-[#B8976C]'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 5: CUSTOMER DETAILS & REVIEW */}
      {step === 5 && (
        <div className="space-y-6">
          <button
            onClick={() => setStep(4)}
            className="inline-flex items-center text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Time Selection</span>
          </button>

          <div>
            <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
              Guest Information
            </h1>
            <p className="text-sm text-[#78716C] mt-1">
              Please enter your details to finalize your appointment reservation.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="p-4 bg-stone-100 rounded-2xl border border-[#E8DEC9] space-y-2 text-xs text-[#1C1917]">
            <div className="flex justify-between font-semibold border-b border-[#E8DEC9] pb-2 text-sm">
              <span>{selectedService?.name}</span>
              <span className="text-[#B8976C]">${selectedService?.price}</span>
            </div>
            <div className="flex justify-between text-[#78716C]">
              <span>Specialist:</span>
              <span className="font-medium text-[#1C1917]">
                {isAnyStaff ? 'Any Available Professional' : selectedStaff?.name}
              </span>
            </div>
            <div className="flex justify-between text-[#78716C]">
              <span>Date & Time:</span>
              <span className="font-medium text-[#1C1917]">
                {selectedDate} at {selectedTime}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4 bg-white p-6 rounded-2xl border border-[#E8DEC9]">
            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Elena Vance"
                className="w-full px-4 py-2.5 text-sm border border-[#E8DEC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8976C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. +1 555 019 2834"
                className="w-full px-4 py-2.5 text-sm border border-[#E8DEC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8976C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                Email Address <span className="text-[#78716C] font-normal">(Optional for receipt)</span>
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. elena@example.com"
                className="w-full px-4 py-2.5 text-sm border border-[#E8DEC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8976C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                Special Request / Notes <span className="text-[#78716C] font-normal">(Optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Allergies, scalp sensitivity, style preferences..."
                className="w-full px-4 py-2.5 text-sm border border-[#E8DEC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8976C]"
              ></textarea>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={submitting}
              className="w-full py-3.5 bg-[#1C1917] text-[#FAFAF7] hover:bg-[#B8976C] text-sm font-semibold rounded-xl shadow-soft transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#B8976C]" />
                  <span>Confirm Appointment Reservation</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: CONFIRMATION SUCCESS SCREEN */}
      {step === 6 && confirmedBooking && (
        <div className="space-y-6 text-center max-w-lg mx-auto py-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
              Reservation Confirmed
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#1C1917] mt-1">
              Your Appointment is Set
            </h1>
            <p className="text-xs text-[#78716C] mt-2 leading-relaxed">
              Thank you, <span className="font-semibold text-[#1C1917]">{confirmedBooking.customer.name}</span>. We look forward to welcoming you to {siteConfig.name}.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DEC9] shadow-soft text-left space-y-3">
            <div className="flex justify-between items-center border-b border-[#E8DEC9] pb-3">
              <span className="text-xs text-[#78716C]">Appointment Code</span>
              <span className="font-mono text-sm font-bold text-[#1C1917] bg-[#E8DEC9]/40 px-2.5 py-1 rounded-md">
                {confirmedBooking.appointmentCode}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#78716C]">Service:</span>
                <span className="font-semibold text-[#1C1917]">{confirmedBooking.service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Specialist:</span>
                <span className="font-medium text-[#1C1917]">{confirmedBooking.staff?.name || 'Assigned Specialist'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Date & Time:</span>
                <span className="font-medium text-[#1C1917]">{confirmedBooking.date} at {confirmedBooking.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Total Price:</span>
                <span className="font-serif font-bold text-[#B8976C] text-sm">${confirmedBooking.price}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8DEC9] text-[11px] text-[#78716C] leading-normal">
              📍 {siteConfig.address}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={getAppointmentConfirmationWhatsAppLink(
                confirmedBooking.appointmentCode,
                confirmedBooking.service.name,
                confirmedBooking.date,
                confirmedBooking.startTime
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm via WhatsApp</span>
            </a>

            <a
              href={`tel:${siteConfig.phone}`}
              className="py-3 px-4 border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Salon</span>
            </a>
          </div>

          <div className="pt-4 border-t border-[#E8DEC9]">
            <button
              onClick={() => {
                setStep(1);
                setSelectedService(null);
                setConfirmedBooking(null);
              }}
              className="text-xs font-medium text-[#78716C] hover:text-[#1C1917] underline"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
