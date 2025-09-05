'use client';

import { useEffect, useState } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

export default function useAuth() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const [isAuthenticatedLocal, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated !== isAuthenticatedLocal) {
      setIsAuthenticated(isAuthenticated);
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated: isLoading ? null : isAuthenticatedLocal };
}
