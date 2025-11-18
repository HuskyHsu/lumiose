import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BackButton() {
  return (
    <Link
      to='/'
      className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors'
    >
      <ArrowLeft size={20} />
      Back to Pokedex
    </Link>
  );
}
