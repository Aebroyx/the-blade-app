import { User } from '@/store/features/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface LoginResponse {
  user: RegisterResponse;
}

class UserService {
  private async fetchWithError(url: string, options: RequestInit = {}) {
    console.log('Making request to:', url, 'with options:', {
      ...options,
      body: options.body ? JSON.parse(options.body as string) : undefined
    });

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = 'Something went wrong';
      try {
        const error = JSON.parse(responseText);
        errorMessage = error.error || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing response:', e);
      throw new Error('Invalid response from server');
    }
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.fetchWithError(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.fetchWithError(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
    });
  }

  async logout(): Promise<void> {
    // You might want to call a logout endpoint here if you have one
    // For now, we'll just clear the tokens on the client side
  }

  async getCurrentUser(token: string): Promise<User> {
    return this.fetchWithError(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const userService = new UserService(); 