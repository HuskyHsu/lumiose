import Navigation from '@/components/Navigation';
import About from '@/pages/About';
import Home from '@/pages/Home';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />
      <main className='container mx-auto p-8'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
