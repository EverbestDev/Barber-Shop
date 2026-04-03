export interface UserRegistration {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface BookingBase {
  service: string;
  date: string;
  barber: string;
  barber_id?: string;
  amount?: number;
}

export type BookingCreate = BookingBase;

export interface Booking extends BookingBase {
  id?: string;
  user_id: string;
  status: string;
  payment_status: string;
  stripe_session_id?: string;
  created_at: string;
}
