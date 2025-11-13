import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div
      className='min-h-screen'
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}images/pattern_hex.png)`,
      }}
    >
      {/* <Navigation /> */}
      <main className='container mx-auto p-4 md:p-8 max-w-6xl'>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
