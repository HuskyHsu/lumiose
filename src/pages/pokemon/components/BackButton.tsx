import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  const [referrer, setReferrer] = useState<string | null>(null);

  useEffect(() => {
    // Store the referrer when component mounts
    // This will be the page that brought us to this Pokemon detail page
    const storedReferrer = sessionStorage.getItem('pokemonListReferrer');
    if (storedReferrer) {
      setReferrer(storedReferrer);
    }
  }, []);

  const handleBack = () => {
    // If we have a stored referrer that looks like the home page (with or without filters)
    // navigate back to it to preserve filters
    if (referrer && (referrer === '/' || referrer.startsWith('/?'))) {
      navigate(referrer);
    } else {
      // Otherwise, just go to home
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md'
    >
      <ArrowLeft size={16} />
      Back to Pokedex
    </button>
  );
}
