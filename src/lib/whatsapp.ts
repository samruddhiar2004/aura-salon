import { siteConfig } from './config';

/**
 * Generates a clean WhatsApp link with pre-filled message text.
 */
export function getWhatsAppLink(message?: string): string {
  const cleanPhone = siteConfig.whatsapp.replace(/[^0-9]/g, '');
  const encodedText = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function getServiceInquiryWhatsAppLink(serviceName: string, price: number): string {
  const text = `Hi ${siteConfig.name}, I would like to inquire about booking the "${serviceName}" ($${price}). Could you share available slots?`;
  return getWhatsAppLink(text);
}

export function getAppointmentConfirmationWhatsAppLink(appointmentCode: string, serviceName: string, date: string, time: string): string {
  const text = `Hi ${siteConfig.name}, I have just booked appointment ${appointmentCode} for "${serviceName}" on ${date} at ${time}. I would like to confirm my details.`;
  return getWhatsAppLink(text);
}

export function getAdminCustomerWhatsAppLink(customerPhone: string, customerName: string, appointmentCode: string): string {
  const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
  const text = `Hello ${customerName}, this is ${siteConfig.name} regarding your appointment (${appointmentCode}).`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
