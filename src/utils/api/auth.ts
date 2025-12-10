// services/auth.ts
import { setCookie } from 'cookies-next';
import api from './apiClient';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>(`/auth/login/`, payload);

  const { access, refresh } = res.data;

  // Save Access Token (localStorage)
  localStorage.setItem('accessToken', access);

  // Save Refresh Token (HttpOnly normally, but using next-safe cookie)
  setCookie('refreshToken', refresh, {
    maxAge: 7 * 24 * 60 * 60,
    sameSite: 'lax',
    secure: false,
  });

  return res.data;
}
