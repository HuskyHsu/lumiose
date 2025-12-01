import './Loading.css';

interface LoadingProps {
  size?: string;
}

export function Loading({ size = 'h-[50vh]' }: LoadingProps) {
  return (
    <div className={`flex ${size} w-full items-center justify-center`}>
      <div className='wobbling relative' />
    </div>
  );
}
