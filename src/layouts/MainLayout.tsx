import Navigation from '@/components/Navigation';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div
      className='min-h-screen'
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}images/pattern_hex.png)`,
      }}
    >
      <Navigation />
      <main className='container mx-auto p-8'>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
