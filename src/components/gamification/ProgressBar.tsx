interface ProgressBarProps {
  current: number;
  max: number;
  className?: string;
}

const ProgressBar = ({ current, max, className = "" }: ProgressBarProps) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`rounded-full transition-all duration-500 ${className}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
