'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/features/authSlice';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Always try to get the current user - the cookie will be sent automatically if it exists
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(setCredentials({ user: data }));
        } else {
          // Clear any stale user data
          dispatch(setCredentials({ user: null }));
        }
      } catch (error) {
        // Clear any stale user data on error
        dispatch(setCredentials({ user: null }));
      }
    };

    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
} 