import { apiClient } from './client';
import { LoginRequest, LoginResponse } from '@/types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/api/auth/login',
      credentials
    );
    return response.data;
  },
};
