# AURA Atelier & Spa — Production-Ready Salon Management & Booking System

A real, production-ready salon web application and appointment management platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **SQLite**.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Editorial Brand Design**: Minimal, warm ivory palette, Playfair Display typography, generous whitespace, and luxury photography aesthetics.
- **Mobile-First Booking Engine**: Effortless 5-step booking flow (Select Service → Choose Specialist → Select Date → Select Dynamic Time Slot → Enter Customer Details → Success Screen).
- **Anti-Double-Booking Protection**: Real-time slot availability algorithm considering salon operating hours, weekly closed days, lunch breaks, individual staff working schedules, and blackout holiday dates.
- **WhatsApp Direct Connect**: Automated pre-filled WhatsApp links for booking inquiries, appointment confirmations, and direct salon communication.
- **Self-Service Booking Lookup**: Customers can search and view their appointment status anytime using their `AUR-XXXX` code or phone number.
- **Service Menu & Pricing**: Comprehensive treatment menu categorized by Hair, Colour, Skin, Nails, Makeup, Spa, and Packages.
- **Promotions & Offers**: View seasonal promotional codes and packages.
- **Atelier Visual Gallery**: High-resolution gallery previewing salon interior and treatment results.
- **Concierge Contact & Maps**: Interactive Google Maps embed, operating hours, direct phone call CTAs.

### 💼 Salon Owner & Admin Management (`/admin`)
- **Secure Authentication**: Protected dashboard with JWT HTTP-only cookies and bcrypt password hashing.
- **Operations Overview**: Today's appointments schedule feed, real-time status updates (Confirm, Complete, Cancel), and business telemetry (revenue, visits, customers).
- **Appointments Manager**: Search, filter by status or date, reschedule modal, and quick WhatsApp/Call customer triggers.
- **Service Catalogue Manager**: Full CRUD for treatment services, pricing, durations, categories, and featured status.
- **Staff & Specialist Manager**: Full CRUD for stylists, working hours, shift schedules, and assigned services.
- **Schedule & Availability Manager**: Weekly opening/closing hours per weekday, lunch breaks, and blackout holiday dates.
- **Customer Directory**: Guest profiles, total visit counts, spending history, and appointment history.
- **Offers Manager**: Create and toggle promotional package discounts.
- **Gallery Manager**: Add and categorize salon portfolio images.
- **Branding & Settings**: Centralized configuration for salon name, address, phone, WhatsApp number, and email.

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
npm install
```

### 2. Database Setup & Seed
```bash
# Push schema and populate rich seed data
npx prisma db push
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Admin Credentials

- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@aura-salon.com`
- **Password**: `admin123`

---

## 📁 Project Structure

```
c:\UNBUILT\Salon\
├── prisma/
│   ├── schema.prisma          # Database models (User, Service, Staff, Appointment, etc.)
│   └── seed.ts                # Rich production-ready seed data
├── src/
│   ├── app/
│   │   ├── (public)/          # Customer pages (Home, Services, Book, Lookup, Offers, Gallery, Contact)
│   │   ├── admin/             # Admin management pages (Dashboard, Appointments, Services, Staff, etc.)
│   │   └── api/               # REST API endpoints for authentication, booking, and admin CRUD
│   ├── components/
│   │   ├── public/            # Navbar, Footer, BookingFlow components
│   │   └── admin/             # AdminSidebar, AdminHeader components
│   ├── lib/
│   │   ├── db.ts              # Prisma ORM client singleton
│   │   ├── auth.ts            # JWT session cookies & bcrypt password hashing
│   │   ├── booking.ts         # Slot availability & anti-double-booking engine
│   │   ├── whatsapp.ts        # WhatsApp message builder
│   │   └── config.ts          # Salon branding configuration
│   └── types/                 # TypeScript interfaces
├── .env                       # Environment variables
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Custom color palette & fonts configuration
└── package.json
```

---

## 🛠️ Production Build & Verification

```bash
# Verify Next.js compilation & build
npm run build

# Start production server
npm run start
```
