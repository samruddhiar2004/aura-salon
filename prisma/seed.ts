import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database for AURA Atelier & Spa...');

  // Clean existing tables
  await prisma.appointment.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.staffService.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.blackoutDate.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.salonSetting.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Elena Vance (Owner)',
      email: 'admin@aura-salon.com',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Created Admin user:', admin.email);

  // 2. Create Service Categories
  const catHair = await prisma.serviceCategory.create({
    data: { name: 'Hair Styling & Cutting', slug: 'hair', description: 'Precision cuts, bespoke styling, and luxury treatments.', displayOrder: 1 },
  });
  const catColor = await prisma.serviceCategory.create({
    data: { name: 'Hair Colour & Balayage', slug: 'hair-colour', description: 'Custom blonding, subtle highlights, and rich glossy tones.', displayOrder: 2 },
  });
  const catSkin = await prisma.serviceCategory.create({
    data: { name: 'Skin & Facial Aesthetics', slug: 'skin', description: 'Rejuvenating facials, deep cleansing, and clinical glow treatments.', displayOrder: 3 },
  });
  const catNails = await prisma.serviceCategory.create({
    data: { name: 'Nails & Manicure', slug: 'nails', description: 'Russian manicures, BIAB overlays, and spa pedicures.', displayOrder: 4 },
  });
  const catMakeup = await prisma.serviceCategory.create({
    data: { name: 'Makeup & Lash Atelier', slug: 'makeup', description: 'Event makeup, lash lifts, and sculpted brow architecture.', displayOrder: 5 },
  });
  const catSpa = await prisma.serviceCategory.create({
    data: { name: 'Spa & Wellness Rituals', slug: 'spa', description: 'Aromatherapy body massages, scalp detoxing, and holistic relaxation.', displayOrder: 6 },
  });

  // 3. Create Services
  const servicesData = [
    // Hair
    {
      name: 'Signature Cut & Editorial Blowout',
      slug: 'signature-cut-blowout',
      description: 'Personalized consultation, scalp massage, master haircut, and voluminous signature styling.',
      price: 95.0,
      durationMinutes: 60,
      categoryId: catHair.id,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    },
    {
      name: 'Luxury Keratin Smoothing Treatment',
      slug: 'keratin-treatment',
      description: 'Restorative smoothing treatment that eliminates frizz, restores shine, and lasts up to 4 months.',
      price: 250.0,
      durationMinutes: 120,
      categoryId: catHair.id,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
    },
    // Colour
    {
      name: 'Artisanal Balayage & Glossing',
      slug: 'artisanal-balayage',
      description: 'Hand-painted seamless highlights, bespoke toner gloss, bonding treatment, and blow-dry.',
      price: 220.0,
      durationMinutes: 150,
      categoryId: catColor.id,
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    },
    {
      name: 'Full Head Root Touch-Up & Tone',
      slug: 'root-touchup',
      description: 'Precision grey coverage or root refresh paired with a customized shine-enhancing gloss.',
      price: 110.0,
      durationMinutes: 75,
      categoryId: catColor.id,
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
    },
    // Skin
    {
      name: 'Hydra-Glow Deep Cleansing Facial',
      slug: 'hydra-glow-facial',
      description: 'Advanced micro-dermabrasion, lymphatic drainage massage, hyaluronic serum infusion, and LED light mask.',
      price: 140.0,
      durationMinutes: 60,
      categoryId: catSkin.id,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    },
    {
      name: 'Sculpting Buccal & Facial Massage',
      slug: 'sculpting-facial-massage',
      description: 'Intra-oral and muscular contouring technique to release tension, lift cheekbones, and improve tone.',
      price: 160.0,
      durationMinutes: 75,
      categoryId: catSkin.id,
      image: 'https://images.unsplash.com/photo-1512290900676-26c2a48f4134?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
    },
    // Nails
    {
      name: 'Biab Builder Gel Russian Manicure',
      slug: 'biab-gel-manicure',
      description: 'Precision dry e-file cuticle care, strengthening BIAB builder gel overlay, and clean gel color.',
      price: 75.0,
      durationMinutes: 60,
      categoryId: catNails.id,
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    },
    {
      name: 'Luxury Botanical Spa Pedicure',
      slug: 'botanical-spa-pedicure',
      description: 'Warm botanical foot bath, exfoliating scrub, callosity smoothing, foot massage, and non-toxic polish.',
      price: 85.0,
      durationMinutes: 60,
      categoryId: catNails.id,
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
    },
    // Makeup
    {
      name: 'Red Carpet Event Makeup',
      slug: 'event-makeup',
      description: 'Flawless camera-ready skin prep, airbrush foundation, individual false lashes, and lip styling.',
      price: 135.0,
      durationMinutes: 60,
      categoryId: catMakeup.id,
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
    },
    // Spa
    {
      name: 'Japanese Head Spa & Scalp Detox Ritual',
      slug: 'japanese-head-spa',
      description: 'Microscopic scalp analysis, organic scrub, warm waterfall hydro-therapy, and upper body relaxation.',
      price: 175.0,
      durationMinutes: 90,
      categoryId: catSpa.id,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    },
  ];

  const createdServices: Record<string, string> = {};
  for (const s of servicesData) {
    const service = await prisma.service.create({ data: s });
    createdServices[service.slug] = service.id;
  }
  console.log('✅ Created 10 Services');

  // 4. Create Staff Members
  const staff1 = await prisma.staff.create({
    data: {
      name: 'Ananya Sharma',
      role: 'Master Hair Stylist & Balayage Director',
      bio: 'Vidal Sassoon trained with 10+ years specializing in dimensional blonde balayage and precision cutting.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      workDays: '1,2,3,4,5,6',
      startTime: '10:00',
      endTime: '19:00',
    },
  });

  const staff2 = await prisma.staff.create({
    data: {
      name: 'Priya Verma',
      role: 'Lead Esthetician & Skin Specialist',
      bio: 'Certified clinical skin therapist focusing on non-invasive skin rejuvenation and holistically tailored facials.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      workDays: '1,2,3,4,5',
      startTime: '10:00',
      endTime: '18:00',
    },
  });

  const staff3 = await prisma.staff.create({
    data: {
      name: 'Sneha Kapoor',
      role: 'Senior Nail Artist & Spa Director',
      bio: 'Specialist in European dry manicures, BIAB nail health, and intricate minimalist nail art.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      workDays: '2,3,4,5,6',
      startTime: '11:00',
      endTime: '20:00',
    },
  });

  const staff4 = await prisma.staff.create({
    data: {
      name: 'Rohan Mehta',
      role: 'Creative Stylist & Head Spa Specialist',
      bio: 'Expert in holistic hair health, Japanese head spa rituals, and sleek texture transformations.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      workDays: '1,3,4,5,6',
      startTime: '10:00',
      endTime: '19:00',
    },
  });
  console.log('✅ Created 4 Staff Members');

  // Assign staff to services
  await prisma.staffService.createMany({
    data: [
      // Ananya: Hair & Colour
      { staffId: staff1.id, serviceId: createdServices['signature-cut-blowout'] },
      { staffId: staff1.id, serviceId: createdServices['keratin-treatment'] },
      { staffId: staff1.id, serviceId: createdServices['artisanal-balayage'] },
      { staffId: staff1.id, serviceId: createdServices['root-touchup'] },
      // Priya: Skin & Makeup
      { staffId: staff2.id, serviceId: createdServices['hydra-glow-facial'] },
      { staffId: staff2.id, serviceId: createdServices['sculpting-facial-massage'] },
      { staffId: staff2.id, serviceId: createdServices['event-makeup'] },
      // Sneha: Nails
      { staffId: staff3.id, serviceId: createdServices['biab-gel-manicure'] },
      { staffId: staff3.id, serviceId: createdServices['botanical-spa-pedicure'] },
      // Rohan: Hair & Spa
      { staffId: staff4.id, serviceId: createdServices['signature-cut-blowout'] },
      { staffId: staff4.id, serviceId: createdServices['japanese-head-spa'] },
    ],
  });

  // 5. Create Default Weekly Availability (Mon-Sat Open, Sun Closed)
  const defaultAvailability = [
    { dayOfWeek: 0, isOpen: false, openTime: '10:00', closeTime: '18:00', breakStartTime: '14:00', breakEndTime: '15:00' }, // Sun
    { dayOfWeek: 1, isOpen: true, openTime: '10:00', closeTime: '20:00', breakStartTime: '14:00', breakEndTime: '15:00' },  // Mon
    { dayOfWeek: 2, isOpen: true, openTime: '10:00', closeTime: '20:00', breakStartTime: '14:00', breakEndTime: '15:00' },  // Tue
    { dayOfWeek: 3, isOpen: true, openTime: '10:00', closeTime: '20:00', breakStartTime: '14:00', breakEndTime: '15:00' },  // Wed
    { dayOfWeek: 4, isOpen: true, openTime: '10:00', closeTime: '20:00', breakStartTime: '14:00', breakEndTime: '15:00' },  // Thu
    { dayOfWeek: 5, isOpen: true, openTime: '10:00', closeTime: '20:00', breakStartTime: '14:00', breakEndTime: '15:00' },  // Fri
    { dayOfWeek: 6, isOpen: true, openTime: '09:30', closeTime: '19:30', breakStartTime: '14:00', breakEndTime: '15:00' },  // Sat
  ];

  for (const avail of defaultAvailability) {
    await prisma.availability.create({ data: avail });
  }
  console.log('✅ Created Availability Schedule');

  // 6. Create Offers
  await prisma.offer.createMany({
    data: [
      {
        title: 'New Client Glow Experience',
        description: 'Enjoy 20% off your first Hydra-Glow Facial or Artisanal Balayage service.',
        code: 'AURA20',
        discountPercent: 20,
        validUntil: '2026-12-31',
        isActive: true,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Mid-Week Head Spa & Cut Combo',
        description: 'Book a Japanese Head Spa with any Haircut on Tuesday or Wednesday and receive $30 off.',
        code: 'SPAHEADER',
        fixedDiscount: 30.0,
        validUntil: '2026-11-30',
        isActive: true,
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      },
    ],
  });
  console.log('✅ Created Offers');

  // 7. Create Gallery Images
  await prisma.galleryImage.createMany({
    data: [
      { title: 'Modern Atelier Interior', category: 'Interior', imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80', displayOrder: 1 },
      { title: 'Blonde Balayage Finish', category: 'Hair', imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80', displayOrder: 2 },
      { title: 'Hydra-Glow Treatment Room', category: 'Skin', imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', displayOrder: 3 },
      { title: 'Minimalist BIAB Gel Art', category: 'Nails', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', displayOrder: 4 },
      { title: 'Japanese Waterfall Spa Ritual', category: 'Spa', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80', displayOrder: 5 },
      { title: 'Editorial Blowout Styling', category: 'Hair', imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80', displayOrder: 6 },
    ],
  });
  console.log('✅ Created Gallery Images');

  // 8. Create Customers & Appointments (Past, Today, Future)
  const cust1 = await prisma.customer.create({
    data: { name: 'Natasha Roy', phone: '+15550192834', email: 'natasha.roy@example.com', notes: 'Prefers warm organic herbal tea.' },
  });
  const cust2 = await prisma.customer.create({
    data: { name: 'Riya Sen', phone: '+15550987654', email: 'riya.sen@example.com', notes: 'Sensitive scalp, hypoallergenic products only.' },
  });
  const cust3 = await prisma.customer.create({
    data: { name: 'Sophia Chen', phone: '+15550345678', email: 'sophia.chen@example.com' },
  });
  const cust4 = await prisma.customer.create({
    data: { name: 'Aarav Malhotra', phone: '+15550876543', email: 'aarav.m@example.com' },
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper date function
  function getDateOffset(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  await prisma.appointment.createMany({
    data: [
      {
        appointmentCode: 'AUR-1001',
        customerId: cust1.id,
        serviceId: createdServices['signature-cut-blowout'],
        staffId: staff1.id,
        date: todayStr,
        startTime: '10:00',
        endTime: '11:00',
        price: 95.0,
        status: 'CONFIRMED',
        notes: 'First time visit for haircut.',
      },
      {
        appointmentCode: 'AUR-1002',
        customerId: cust2.id,
        serviceId: createdServices['artisanal-balayage'],
        staffId: staff1.id,
        date: todayStr,
        startTime: '11:30',
        endTime: '14:00',
        price: 220.0,
        status: 'PENDING',
        notes: 'Wants golden honey tones.',
      },
      {
        appointmentCode: 'AUR-1003',
        customerId: cust3.id,
        serviceId: createdServices['hydra-glow-facial'],
        staffId: staff2.id,
        date: todayStr,
        startTime: '15:00',
        endTime: '16:00',
        price: 140.0,
        status: 'COMPLETED',
        notes: 'Regular monthly facial client.',
      },
      {
        appointmentCode: 'AUR-1004',
        customerId: cust4.id,
        serviceId: createdServices['japanese-head-spa'],
        staffId: staff4.id,
        date: getDateOffset(1),
        startTime: '11:00',
        endTime: '12:30',
        price: 175.0,
        status: 'CONFIRMED',
      },
      {
        appointmentCode: 'AUR-1005',
        customerId: cust1.id,
        serviceId: createdServices['biab-gel-manicure'],
        staffId: staff3.id,
        date: getDateOffset(2),
        startTime: '14:00',
        endTime: '15:00',
        price: 75.0,
        status: 'CONFIRMED',
      },
    ],
  });
  console.log('✅ Created Demo Customers & Appointments');

  // 9. Create Salon Settings
  const settings = [
    { key: 'salon_name', value: 'AURA Atelier & Spa' },
    { key: 'salon_tagline', value: 'Bespoke Beauty, Elevated Rest & Modern Hair Artistry' },
    { key: 'salon_phone', value: '+1 (555) 234-5678' },
    { key: 'salon_whatsapp', value: '15552345678' },
    { key: 'salon_email', value: 'concierge@aura-salon.com' },
    { key: 'salon_address', value: '452 Beverly Atelier Way, Suite 100, Los Angeles, CA 90210' },
    { key: 'salon_hours', value: 'Mon - Fri: 10am - 8pm | Sat: 9:30am - 7:30pm | Sun: Closed' },
    { key: 'currency_symbol', value: '$' },
  ];

  for (const s of settings) {
    await prisma.salonSetting.create({ data: s });
  }
  console.log('✅ Created Salon Settings');

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
