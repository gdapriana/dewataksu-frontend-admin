interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  text,
  fullScreen = true,
}: LoadingSpinnerProps) {
  const containerClasses = fullScreen
    ? "flex items-center justify-center min-h-screen bg-gray-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center">
        <div
          className="w-12 h-12 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"
          role="status"
          aria-label="loading"
        ></div>
        {text && (
          <p className="mt-4 text-lg font-semibold text-gray-600">{text}</p>
        )}
      </div>
    </div>
  );
}
