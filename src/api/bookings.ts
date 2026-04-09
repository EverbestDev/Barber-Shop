import apiClient from './client';
import type { Booking, BookingCreate } from './types';

export const createBooking = async (data: BookingCreate): Promise<Booking> => {
  const response = await apiClient.post<Booking>('/bookings/', data);
  return response.data;
};

export const fetchMyBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>('/bookings/my');
  return response.data;
};

export const fetchBarberBookings = async (barberId: string): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>(`/bookings/barber/${barberId}`);
  return response.data;
};

export const fetchAllBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>('/bookings/');
  return response.data;
};

export const updateBookingStatus = async (bookingId: string, status: string): Promise<Booking> => {
  const response = await apiClient.patch<Booking>(`/bookings/${bookingId}/status`, { status });
  return response.data;
};

export const refundBooking = async (bookingId: string): Promise<Booking> => {
  // Mock endpoint to handle refund logic, updating status to "refunded"
  const response = await apiClient.patch<Booking>(`/bookings/${bookingId}/status`, { status: 'refunded' });
  return response.data;
};
