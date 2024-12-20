import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { HealthMetrics, UserProfile } from '../types';
import { personalizedML, MLPrediction } from '../services/PersonalizedML';
import { notify } from '../utils/notifications';

interface MLInsightsProps {
  metrics: HealthMetrics[];
  profile?: UserProfile;
}

const MLInsights = ({ metrics, profile }: MLInsightsProps) => {
  const [predictions, setPredictions] = useState<MLPrediction[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      try {
        const predictions = personalizedML(metrics, profile as UserProfile);
        setPredictions(predictions);
      } catch (error) {
        console.error('Failed to get ML predictions:', error);
        notify.error('Failed to analyze health data');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [metrics, profile]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Loading insights...</h2>
        </div>
      </div>
    );
  }

  if (!predictions) return null;

  return (
    <div className="space-y-6">
      {predictions.map((prediction) => (
        <div key={prediction.id} className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold">{prediction.title}</h3>
          <p className="text-gray-600">{prediction.description}</p>
          {prediction.recommendation && (
            <p className="mt-2 text-blue-600">{prediction.recommendation}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MLInsights;