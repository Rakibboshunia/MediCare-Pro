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
      <div className="app-container flex h-screen overflow-hidden bg-bg-primary">
        <Sidebar />
        <div className="main-content flex-1 flex flex-col h-full overflow-hidden w-full md:w-auto">
          <Header />
          <main className="page-content flex-1 overflow-y-auto animate-fade-in pb-20 md:pb-6 relative">
            {children}
          </main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
