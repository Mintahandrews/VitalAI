import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { HealthMetrics } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  metrics: HealthMetrics[];
}

const ProgressChart = ({ metrics }: ProgressChartProps) => {
  const labels = metrics.map(m => format(new Date(m.date), 'MMM d'));

  const data = {
    labels,
    datasets: [
      {
        label: 'Sleep (hours)',
        data: metrics.map(m => m.sleep),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Exercise (minutes)',
        data: metrics.map(m => m.exercise),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Water (glasses)',
        data: metrics.map(m => m.water),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      x: {
        type: 'category' as const,
        display: true,
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return <Line data={data} options={options} />;
};

export default ProgressChart;