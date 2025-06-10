import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface CreateUserData {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // Show success toast
      toast.success('User created successfully');
      // Redirect to users list
      router.push('/users-management');
    },
    onError: (error: Error) => {
      try {
        const errorResponse: ErrorResponse = JSON.parse(error.message);
        if (errorResponse.status === 'error' && errorResponse.message) {
          toast.error(errorResponse.message);
        } else {
          toast.error('Failed to create user');
        }
      } catch {
        toast.error('Failed to create user');
      }
    },
  });
} 