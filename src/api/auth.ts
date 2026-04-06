import apiClient from './client.ts';
import { type UserRegistration, type UserLogin, type AuthResponse, type UserInfo } from './types.ts';

export const registerUser = async (data: UserRegistration): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/users/register', data);
  return response.data;
};

export const loginUser = async (data: UserLogin): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/users/login', data);
  return response.data;
};

export const fetchCurrentUser = async (): Promise<UserInfo> => {
  const response = await apiClient.get<UserInfo>('/users/me');
  return response.data;
};

export const updateCurrentUser = async (data: import('./types.ts').UserUpdate): Promise<UserInfo> => {
  const response = await apiClient.patch<UserInfo>('/users/me', data);
  return response.data;
};
