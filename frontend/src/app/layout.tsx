import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientLayout from '../components/ClientLayout';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Citas Hospitalarias',
  description: 'Sistema para gestionar citas médicas en un hospital',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientLayout>
          <main style={{ padding: '20px' }}>
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
} 