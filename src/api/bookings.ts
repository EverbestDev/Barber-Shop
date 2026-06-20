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

export const rescheduleBooking = async (bookingId: string, newDate: string): Promise<Booking> => {
  const response = await apiClient.patch<Booking>(`/bookings/${bookingId}/reschedule?new_date=${newDate}`);
  return response.data;
};

export const fetchBookingByCode = async (code: string): Promise<Booking> => {
  const response = await apiClient.get<Booking>(`/bookings/verify/${code}`);
  return response.data;
};

export const checkInBooking = async (bookingId: string): Promise<Booking> => {
  const response = await apiClient.patch<Booking>(`/bookings/${bookingId}/checkin`);
  return response.data;
};

export const nudgeBooking = async (bookingId: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(`/bookings/${bookingId}/nudge`);
  return response.data;
};

