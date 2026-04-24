import apiClient from './client';
import type { UserInfo } from './types';

export const fetchAllUsers = async (): Promise<UserInfo[]> => {
  const response = await apiClient.get<UserInfo[]>('/users/');
  return response.data;
};

export const updateUserRole = async (userId: string, role: string): Promise<UserInfo> => {
  const response = await apiClient.patch<UserInfo>(`/users/${userId}/role?role=${role}`);
  return response.data;
};

export const fetchBarbers = async (): Promise<UserInfo[]> => {
  const response = await apiClient.get<UserInfo[]>('/users/barbers');
  return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};

export const fetchSubscriberStats = async (): Promise<{ count: number }> => {
  const response = await apiClient.get<{ count: number }>('/subscribers/stats');
  return response.data;
};

export const fetchAllSubscribers = async (): Promise<any[]> => {
  const response = await apiClient.get<any[]>('/subscribers/');
  return response.data;
};

export const sendNewsletter = async (data: { subject: string, content: string, target: string, image_url?: string, personalize?: boolean }): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/subscribers/newsletter', data);
  return response.data;
};

