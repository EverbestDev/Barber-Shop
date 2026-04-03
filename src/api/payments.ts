import apiClient from './client';

export const createCheckoutSession = async (bookingId: string): Promise<{ id: string; url: string }> => {
  const response = await apiClient.post<{ id: string; url: string }>(`/payments/create-checkout-session?booking_id=${bookingId}`);
  return response.data;
};
