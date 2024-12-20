import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProgressProps {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
}

const Progress = ({ data, options = {} }: ProgressProps) => {
  // Add validation
  if (!data || !data.labels || !data.datasets) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const defaultOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="h-[300px]">
        <Line data={data} options={{ ...defaultOptions, ...options }} />
      </div>
    </div>
  );
};

export default Progress;
