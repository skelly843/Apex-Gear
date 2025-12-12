import { z } from 'zod';

export const holdSchema = z.object({
  serviceId: z.number().int().positive(),
  startTime: z.string().datetime(),
  customerDetails: z.object({
    customer_name: z.string().min(2),
    customer_email: z.string().email(),
    customer_phone: z.string().optional(),
    address: z.string(),
    zone_id: z.number().int().positive(),
    lat: z.number(),
    lng: z.number(),
  }),
});

export const bookingRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string(),
  service_details: z.string().optional(),
});

export const geocodeSchema = z.object({
  address: z.string().min(3),
});
