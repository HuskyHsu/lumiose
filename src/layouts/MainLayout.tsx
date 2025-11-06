import Navigation from '@/components/Navigation';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />
      <main className='container mx-auto p-8'>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
