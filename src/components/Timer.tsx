import { useEffect, useState, useRef } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  startTime: number;
  endTime?: number;
  duration?: number; // Duration in seconds for countdown mode
  onTimeUp?: () => void;
}

export const Timer = ({ startTime, endTime, duration, onTimeUp }: TimerProps) => {
  const [elapsed, setElapsed] = useState(0);
  const onTimeUpRef = useRef(onTimeUp);
  
  // Keep onTimeUp ref updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (endTime) {
      setElapsed(endTime - startTime);
      return;
    }

    // Check immediately if time is already up
    const initialElapsed = Date.now() - startTime;
    setElapsed(initialElapsed);
    
    if (duration && initialElapsed >= duration * 1000) {
      if (onTimeUpRef.current) onTimeUpRef.current();
      return;
    }

    const interval = setInterval(() => {
      const currentElapsed = Date.now() - startTime;
      setElapsed(currentElapsed);

      // Countdown mode: check if time is up
      if (duration && currentElapsed >= duration * 1000) {
        clearInterval(interval);
        if (onTimeUpRef.current) onTimeUpRef.current();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, duration]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    
    // Countdown mode
    if (duration) {
      const remainingSeconds = Math.max(0, duration - totalSeconds);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      const isLowTime = remainingSeconds <= 60;
      return {
        text: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        isLowTime
      };
    }
    
    // Count up mode
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      text: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      isLowTime: false
    };
  };

  const timeData = formatTime(elapsed);

  return (
    <div className={`flex items-center gap-2 text-2xl font-bold ${
      timeData.isLowTime ? 'text-destructive animate-pulse' : 'text-black'
    }`}>
      <Clock className="w-6 h-6" />
      <span>{timeData.text}</span>
    </div>
  );
};
