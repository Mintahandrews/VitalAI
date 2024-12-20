import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Brain, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { HealthMetrics } from '../types';

interface Prediction {
  metric: string;
  currentTrend: 'improving' | 'declining' | 'stable';
  prediction: number;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  recommendation: string;
}

interface PredictiveInsightsProps {
  metrics: HealthMetrics[];
}

const PredictiveInsights = ({ metrics }: PredictiveInsightsProps) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeTrends();
  }, [metrics]);

  const analyzeTrends = async () => {
    if (metrics.length < 7) {
      setLoading(false);
      return;
    }

    try {
      // Prepare data for analysis
      const sleepData = metrics.map(m => m.sleep);
      const stressData = metrics.map(m => m.stressLevel || 3);
      const exerciseData = metrics.map(m => m.exercise);

      // Simple linear regression using TensorFlow.js
      const predictions: Prediction[] = [];

      // Analyze sleep patterns
      const sleepPrediction = await predictMetric(sleepData);
      predictions.push({
        metric: 'Sleep Quality',
        currentTrend: getTrend(sleepData),
        prediction: sleepPrediction.value,
        confidence: sleepPrediction.confidence,
        risk: getRiskLevel(sleepPrediction.value, 'sleep'),
        recommendation: getSleepRecommendation(sleepPrediction.value)
      });

      // Analyze stress levels
      const stressPrediction = await predictMetric(stressData);
      predictions.push({
        metric: 'Stress Level',
        currentTrend: getTrend(stressData, true), // reverse for stress (lower is better)
        prediction: stressPrediction.value,
        confidence: stressPrediction.confidence,
        risk: getRiskLevel(stressPrediction.value, 'stress'),
        recommendation: getStressRecommendation(stressPrediction.value)
      });

      // Analyze exercise patterns
      const exercisePrediction = await predictMetric(exerciseData);
      predictions.push({
        metric: 'Exercise Consistency',
        currentTrend: getTrend(exerciseData),
        prediction: exercisePrediction.value,
        confidence: exercisePrediction.confidence,
        risk: getRiskLevel(exercisePrediction.value, 'exercise'),
        recommendation: getExerciseRecommendation(exercisePrediction.value)
      });

      setPredictions(predictions);
    } catch (error) {
      console.error('Error analyzing trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const predictMetric = async (data: number[]): Promise<{ value: number; confidence: number }> => {
    const xData = tf.tensor2d([0, 1, 2, 3, 4, 5, 6], [7, 1]);
    const yData = tf.tensor2d(data, [7, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    await model.fit(xData, yData, { epochs: 100, verbose: 0 });

    const prediction = model.predict(tf.tensor2d([7], [1, 1])) as tf.Tensor;
    const value = (await prediction.data())[0];
    
    // Calculate confidence based on prediction variance
    const variance = tf.moments(yData).variance.dataSync()[0];
    const confidence = 1 - Math.min(variance / Math.abs(value), 0.5);

    return { value, confidence };
  };

  const getTrend = (data: number[], reverse = false): 'improving' | 'declining' | 'stable' => {
    const recentAvg = data.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const previousAvg = data.slice(3, 6).reduce((a, b) => a + b, 0) / 3;
    const diff = recentAvg - previousAvg;
    
    if (Math.abs(diff) < 0.1) return 'stable';
    return reverse ? 
      (diff > 0 ? 'declining' : 'improving') :
      (diff > 0 ? 'improving' : 'declining');
  };

  const getRiskLevel = (prediction: number, metric: string): 'low' | 'medium' | 'high' => {
    switch (metric) {
      case 'sleep':
        return prediction < 6 ? 'high' : prediction < 7 ? 'medium' : 'low';
      case 'stress':
        return prediction > 4 ? 'high' : prediction > 3 ? 'medium' : 'low';
      case 'exercise':
        return prediction < 15 ? 'high' : prediction < 30 ? 'medium' : 'low';
      default:
        return 'medium';
    }
  };

  const getSleepRecommendation = (prediction: number): string => {
    if (prediction < 6) {
      return "Your sleep pattern shows a concerning trend. Consider: setting a consistent bedtime, avoiding screens before bed, and creating a relaxing bedtime routine.";
    }
    if (prediction < 7) {
      return "Your sleep could be improved. Try: limiting caffeine intake after 2 PM and ensuring your bedroom is cool and dark.";
    }
    return "Your sleep pattern is healthy. Keep maintaining your good sleep habits!";
  };

  const getStressRecommendation = (prediction: number): string => {
    if (prediction > 4) {
      return "High stress levels predicted. Consider: daily meditation, regular exercise, and possibly consulting a wellness professional.";
    }
    if (prediction > 3) {
      return "Moderate stress levels expected. Try incorporating breathing exercises and short breaks throughout your day.";
    }
    return "Your stress management is effective. Continue your current wellness practices.";
  };

  const getExerciseRecommendation = (prediction: number): string => {
    if (prediction < 15) {
      return "Exercise levels are trending low. Try scheduling short workouts and setting realistic daily movement goals.";
    }
    if (prediction < 30) {
      return "Moderate activity level predicted. Consider increasing intensity or duration of your workouts gradually.";
    }
    return "Great exercise consistency! Keep up your current routine while monitoring for signs of overtraining.";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Analyzing Health Patterns...</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Predictive Health Insights</h2>
      </div>

      {predictions.length === 0 ? (
        <p className="text-gray-600">
          Not enough data to generate predictions. Continue tracking your health metrics for personalized insights.
        </p>
      ) : (
        <div className="space-y-6">
          {predictions.map((prediction, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                prediction.risk === 'high'
                  ? 'border-red-200 bg-red-50'
                  : prediction.risk === 'medium'
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{prediction.metric}</h3>
                <div className="flex items-center gap-2">
                  {prediction.currentTrend === 'improving' ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : prediction.currentTrend === 'declining' ? (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  ) : (
                    <div className="w-5 h-0.5 bg-gray-400"></div>
                  )}
                  {prediction.risk === 'high' && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>

              <div className="text-sm space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Prediction Confidence</span>
                  <span>{Math.round(prediction.confidence * 100)}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 rounded-full h-2"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  ></div>
                </div>

                <p className="mt-4 text-gray-700">{prediction.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictiveInsights;