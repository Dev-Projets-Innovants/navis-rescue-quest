import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  startTime: number;
  endTime?: number;
}

export const Timer = ({ startTime, endTime }: TimerProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (endTime) {
      setElapsed(endTime - startTime);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-2xl font-bold text-primary">
      <Clock className="w-6 h-6" />
      <span>{formatTime(elapsed)}</span>
    </div>
  );
};
