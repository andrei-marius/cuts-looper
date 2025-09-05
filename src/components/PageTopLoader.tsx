'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import '../styles/nprogress.css';

export default function TopLoader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return null;
}
