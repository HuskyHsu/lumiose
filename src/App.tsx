import MainLayout from '@/layouts/MainLayout';
import { Route, Routes } from 'react-router-dom';

import About from '@/pages/about';
import Home from '@/pages/home';
import PokemonDetail from '@/pages/pokemon';

function App() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='pokemon/:link' element={<PokemonDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
