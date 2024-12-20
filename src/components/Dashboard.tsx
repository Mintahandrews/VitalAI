import { useState } from "react";
import { format } from "date-fns";
import { generateInitialMetrics } from "../utils/storage";
import Progress from "./Progress";
import WeeklySummary from "./WeeklySummary";
import Calendar from "./Calendar";
import StatsGrid from "./StatsGrid";
import AIHealthAnalysis from "./analysis/AIHealthAnalysis";
import MentalHealth from "./MentalHealth";
import WorkoutRoutines from "./WorkoutRoutines";
import PredictiveInsights from "./PredictiveInsights";
import { ChartOptions } from "chart.js";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(generateInitialMetrics());
  const [activeTab, setActiveTab] = useState("overview");
  const profile = JSON.parse(localStorage.getItem("userProfile") || "null");

  // Format data for the Progress chart
  const chartData = {
    labels: metrics.map((m) => format(new Date(m.date), "MMM d")),
    datasets: [
      {
        label: "Sleep (hours)",
        data: metrics.map((m) => Number(m.sleep.toFixed(1))),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Exercise (minutes)",
        data: metrics.map((m) => m.exercise),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Water (glasses)",
        data: metrics.map((m) => m.water),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            if (label.includes("Sleep")) {
              return `${label}: ${value.toFixed(1)}h`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: (value) => {
            return Number(value).toFixed(1);
          },
        },
      },
      x: {
        type: "category",
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          {["overview", "mental", "workouts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <StatsGrid metrics={metrics} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIHealthAnalysis metrics={metrics} profile={profile} />
            <PredictiveInsights metrics={metrics} />
          </div>
          <Progress data={chartData} options={chartOptions} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Calendar metrics={metrics} />
          </div>
          <WeeklySummary metrics={metrics} />
        </div>
      )}

      {activeTab === "mental" && (
        <MentalHealth
          metrics={metrics[0]}
          onUpdate={(updates) => {
            const newMetrics = [...metrics];
            newMetrics[0] = { ...newMetrics[0], ...updates };
            setMetrics(newMetrics);
            localStorage.setItem("healthMetrics", JSON.stringify(newMetrics));
          }}
        />
      )}

      {activeTab === "workouts" && <WorkoutRoutines />}
    </div>
  );
};

export default Dashboard;
