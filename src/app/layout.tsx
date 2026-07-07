import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediCare Pro | Hospital Management',
  description: 'Premium AI-powered hospital management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Header />
            <main className="page-content animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
