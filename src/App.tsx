import { ReleaseNotesModal } from '@/components/ReleaseNotesModal';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useReleaseChecker } from '@/hooks/useReleaseChecker';
import MainLayout from '@/layouts/MainLayout';
import { Route, Routes } from 'react-router-dom';

import Home from '@/pages/home';
import PokemonDetail from '@/pages/pokemon';
import MoveList from '@/pages/move';

function App() {
  // init Google Analytics
  useAnalytics();

  // Check for new releases
  const { releases, showModal, closeModal } = useReleaseChecker();

  return (
    <>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='pokemon/:link' element={<PokemonDetail />} />
          <Route path='moves' element={<MoveList />} />
        </Route>
      </Routes>

      {releases.length > 0 && (
        <ReleaseNotesModal releases={releases} isOpen={showModal} onClose={closeModal} />
      )}
    </>
  );
}

export default App;
