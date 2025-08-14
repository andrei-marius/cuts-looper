'use client'

import { useEffect } from 'react';
import { useStore } from '../lib/store';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

export default function useAuth() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const { setAuth, ...store } = useStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated !== useStore.getState().isAuthenticated) {
      setAuth(isAuthenticated);
    }
  }, [isAuthenticated, isLoading, setAuth]);

  return store;
}
