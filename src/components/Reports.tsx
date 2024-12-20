import { useState } from 'react';
import { saveAs } from 'file-saver';
import { FileText, Download } from 'lucide-react';
import { HealthMetrics } from '../types';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface ReportsProps {
  metrics: HealthMetrics[];
}

const Reports = ({ metrics }: ReportsProps) => {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');

  const generateReport = () => {
    const today = new Date();
    let reportData: HealthMetrics[];
    let filename: string;

    if (reportType === 'weekly') {
      const start = startOfWeek(today);
      const end = endOfWeek(today);
      reportData = metrics.filter(m => {
        const date = new Date(m.date);
        return date >= start && date <= end;
      });
      filename = `health-report-week-${format(today, 'yyyy-MM-dd')}`;
    } else {
      const thirtyDaysAgo = subDays(today, 30);
      reportData = metrics.filter(m => new Date(m.date) >= thirtyDaysAgo);
      filename = `health-report-month-${format(today, 'yyyy-MM-dd')}`;
    }

    const csvContent = generateCSV(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}.csv`);
  };

  const generateCSV = (data: HealthMetrics[]) => {
    const headers = ['Date', 'Sleep', 'Steps', 'Calories', 'Water', 'Exercise', 'Mood'];
    const rows = data.map(m => [
      m.date,
      m.sleep,
      m.steps,
      m.calories,
      m.water,
      m.exercise,
      m.mood
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Health Reports</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as 'weekly' | 'monthly')}
            className="rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
          </select>
          
          <button
            onClick={generateReport}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Report Contents</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Daily sleep duration</li>
            <li>Step count</li>
            <li>Calorie intake</li>
            <li>Water consumption</li>
            <li>Exercise minutes</li>
            <li>Mood tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;