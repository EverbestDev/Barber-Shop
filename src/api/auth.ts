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

export const googleAuth = async (credential: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/users/auth/google', { credential });
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

export const verifyOTP = async (email: string, code: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(`/users/verify-otp?email=${email}&code=${code}`);
  return response.data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(`/users/forgot-password?email=${email}`);
  return response.data;
};

export const resetPassword = async (email: string, code: string, new_password: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(`/users/reset-password?email=${email}&code=${code}&new_password=${new_password}`);
  return response.data;
};

export const requestDeleteOTP = async (): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/users/request-delete-otp');
  return response.data;
};

export const confirmDeleteAccount = async (code: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(`/users/confirm-delete?code=${code}`);
  return response.data;
};
