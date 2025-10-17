import api from './api';
import type { User } from '../features/auth/authSlice';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
  refresh: () => api.post<AuthResponse>('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get<User>('/auth/me'),
  updateProfile: (data: Partial<User>) => api.put<User>('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.put('/auth/password', data),
};