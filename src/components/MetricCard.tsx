import { Plus, Minus } from 'lucide-react';
import { ReactNode, memo } from 'react';

interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  unit: string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const MetricCard = memo(({ 
  icon, 
  title, 
  value, 
  unit, 
  onChange,
  min = 0,
  max = Infinity 
}: MetricCardProps) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <button
          onClick={handleDecrement}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          aria-label={`Decrease ${title}`}
          disabled={value <= min}
        >
          <Minus className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-gray-500 ml-1">{unit}</span>
        </div>
        
        <button
          onClick={handleIncrement}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          aria-label={`Increase ${title}`}
          disabled={value >= max}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

MetricCard.displayName = 'MetricCard';

export default MetricCard;