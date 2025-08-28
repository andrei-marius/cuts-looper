'use client'

import { useEffect } from 'react';
import { useStore } from '../lib/store';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

export default function useAuth() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const { setAuth, isAuthenticated: isAuthenticatedLocal } = useStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated !== isAuthenticatedLocal) {
      setAuth(isAuthenticated);
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated: isLoading ? null : isAuthenticatedLocal };
}
