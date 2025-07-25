'use client';

import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { UserDropdown } from '@/components/UserDropdown';
import { Loader2 } from 'lucide-react';

export default function NavBar() {
    const { isAuthenticated, isLoading } = useKindeBrowserClient();

    return (
        <header className='w-full h-[80px] shadow-md shadow-gray-300 p-5'>
            <nav className='w-full h-full flex items-center justify-between'>
                <a href='/' className='flex items-center font-semibold'> 
                <svg xmlns="http://www.w3.org/2000/svg" id="yt-ringo2-svg_yt6" width="29" height="20" viewBox="0 0 29 20" focusable="false" aria-hidden="true" className="mr-2 pointer-events: none; display: inherit; width: 100%; height: 100%;">
                    <g>
                        <path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"></path>
                        <path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"></path>
                    </g>
                </svg>
                    CutsLooper
                </a>

                {isLoading ? (
                    <Loader2 className="animate-spin h-6 w-6 ml-auto" />
                ) : isAuthenticated ? (
                    <UserDropdown />
                ) : (
                    <LoginLink
                        href='api/auth/login'
                    >
                        Log in
                    </LoginLink>
                )}
            </nav>
        </header>
    );
}
