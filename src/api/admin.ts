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
