import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors'
    >
      <ArrowLeft size={20} />
      Back to Pokedex
    </button>
  );
}
