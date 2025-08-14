import './globals.css';
import { Toaster } from 'react-hot-toast';
import NavBar from '@/components/NavBar';
import { Metadata } from 'next';
import TopLoader from '@/components/PageTopLoader';

export const metadata: Metadata = {
  title: "CutsLooper",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopLoader />
        <Toaster position="top-center" />
        <NavBar />
        {children}
      </body>
    </html>
  );
}

