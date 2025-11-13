interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className='flex justify-center items-center h-64'>
      <p className='text-lg text-red-500'>Error: {message}</p>
    </div>
  );
}

export default ErrorMessage;
