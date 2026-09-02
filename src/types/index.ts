export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  durationMinutes: number;
  image?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface StaffItem {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  image?: string | null;
  isAvailable: boolean;
  workDays: string;
  startTime: string;
  endTime: string;
  staffServices?: {
    serviceId: string;
    service?: ServiceItem;
  }[];
}

export interface AppointmentItem {
  id: string;
  appointmentCode: string;
  customerId: string;
  serviceId: string;
  staffId?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: AppointmentStatus;
  notes?: string | null;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  };
  service: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
  };
  staff?: {
    id: string;
    name: string;
    role: string;
  } | null;
  createdAt: string | Date;
}

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
  reason?: string;
}

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  code?: string | null;
  discountPercent?: number | null;
  fixedDiscount?: number | null;
  validUntil: string;
  isActive: boolean;
  image?: string | null;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  displayOrder: number;
}
