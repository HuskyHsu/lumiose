import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首頁' },
    { path: '/about', label: '關於我們' },
  ];

  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='container mx-auto px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-8'>
            <Link to='/' className='text-xl font-bold text-gray-900'>
              Lumiose
            </Link>
            <div className='flex space-x-6'>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
