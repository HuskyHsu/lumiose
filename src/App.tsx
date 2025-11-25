import { ReleaseNotesModal } from '@/components/ReleaseNotesModal';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useReleaseChecker } from '@/hooks/useReleaseChecker';
import MainLayout from '@/layouts/MainLayout';
import { Route, Routes } from 'react-router-dom';

import Home from '@/pages/home';
import PokemonDetail from '@/pages/pokemon';

function App() {
  // init Google Analytics
  useAnalytics();

  // Check for new releases
  const { release, showModal, closeModal } = useReleaseChecker();

  return (
    <>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='pokemon/:link' element={<PokemonDetail />} />
        </Route>
      </Routes>

      {release && <ReleaseNotesModal release={release} isOpen={showModal} onClose={closeModal} />}
    </>
  );
}

export default App;
