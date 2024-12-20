import { useState } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { HealthMetrics } from "../types";
import { Calendar as CalendarIcon } from "lucide-react";

interface HealthCalendarProps {
  metrics: HealthMetrics[];
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const HealthCalendar = ({ metrics }: HealthCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());

  const getDayMetrics = (date: Date) => {
    return metrics.find(
      (m) =>
        format(new Date(m.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const formatMetricValue = (key: keyof HealthMetrics, value: number) => {
    if (key === "sleep") {
      return `${value.toFixed(1)}h`;
    }
    if (key === "steps") {
      return value.toLocaleString();
    }
    if (key === "exercise") {
      return `${value} min`;
    }
    if (key === "water") {
      return `${value} glasses`;
    }
    return value;
  };

  const tileContent = ({ date }: { date: Date }) => {
    const dayMetrics = getDayMetrics(date);
    if (!dayMetrics) return null;

    return (
      <div className="text-xs mt-1">
        <div className="flex items-center justify-center gap-1">
          <CalendarIcon className="w-3 h-3 text-purple-500" />
          <span>{Number(dayMetrics.sleep.toFixed(1))}h</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Health Calendar</h2>
      <ReactCalendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={tileContent}
        className="w-full rounded-lg"
      />

      {selectedDate instanceof Date && getDayMetrics(selectedDate) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">
            {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(getDayMetrics(selectedDate) || {})
              .filter(([key]) =>
                ["sleep", "steps", "water", "exercise"].includes(key)
              )
              .map(([key, value]) => (
                <div key={key}>
                  <span className="text-gray-600 capitalize">{key}:</span>
                  <span className="ml-2 font-medium">
                    {formatMetricValue(
                      key as keyof HealthMetrics,
                      value as number
                    )}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCalendar;
