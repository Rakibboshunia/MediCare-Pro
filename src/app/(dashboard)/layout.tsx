import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { MobileNavProvider } from '@/components/MobileNavProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileNavProvider>
      <div className="app-container flex overflow-hidden">
        <Sidebar />
        <div className="main-content flex-1 w-full md:w-auto">
          <Header />
          <main className="page-content animate-fade-in pb-20 md:pb-6">
            {children}
          </main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
