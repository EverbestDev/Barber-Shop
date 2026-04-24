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
  phone?: string;
  role: string;
  cookie_consent: boolean;
  created_at: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  phone?: string;
  cookie_consent?: boolean;
}

export interface BookingBase {
  service: string;
  date: string;
  barber: string;
  barber_id?: string;
  amount?: number;
  home_address?: string;
}

export interface BookingCreate extends BookingBase {
  guest_email?: string;
  guest_name?: string;
}

export interface Booking extends BookingBase {
  id?: string;
  user_id?: string;
  guest_email?: string;
  guest_name?: string;
  status: string;
  payment_status: string;
  stripe_session_id?: string;
  created_at: string;
}
