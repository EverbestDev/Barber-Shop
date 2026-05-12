import apiClient from './client';

export const createCheckoutSession = async (bookingId: string, origin?: string): Promise<{ id: string; url: string }> => {
  const currentOrigin = origin || window.location.origin;
  const response = await apiClient.post<{ id: string; url: string }>(`/payments/create-checkout-session?booking_id=${bookingId}&origin=${encodeURIComponent(currentOrigin)}`);
  return response.data;
};
