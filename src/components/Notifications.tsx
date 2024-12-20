import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Notifications = () => {
  useEffect(() => {
    // Check water intake every 2 hours
    const waterInterval = setInterval(() => {
      const metrics = localStorage.getItem('metrics');
      if (metrics) {
        const todayMetrics = JSON.parse(metrics);
        if (todayMetrics.water < 8) {
          toast('Remember to drink water! 💧', {
            icon: '💧',
            duration: 5000,
          });
        }
      }
    }, 2 * 60 * 60 * 1000);

    // Check for movement every hour
    const moveInterval = setInterval(() => {
      toast('Time to move! Take a short walk. 🚶‍♂️', {
        icon: '🚶‍♂️',
        duration: 5000,
      });
    }, 60 * 60 * 1000);

    return () => {
      clearInterval(waterInterval);
      clearInterval(moveInterval);
    };
  }, []);

  return (
    <div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Notifications;