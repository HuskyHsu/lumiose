interface LoadingSpinnerProps {
  message?: string;
}

function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className='flex justify-center items-center h-64'>
      <p className='text-lg'>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
