import apiClient from './client.ts';

export interface ContactData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const submitContactForm = async (data: ContactData): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/contact/', data);
  return response.data;
};
