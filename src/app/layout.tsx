import './globals.css';
import { Toaster } from 'react-hot-toast';
import NavBar from '@/components/NavBar';
import { Metadata } from 'next';

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
        <Toaster position="top-right" />
        <NavBar />
        {children}
      </body>
    </html>
  );
}

