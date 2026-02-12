import { useRef, useCallback } from 'react';

interface DoubleTapOptions {
  threshold?: number;
  onDoubleTap: () => void;
  onSingleTap?: () => void;
}

export const useDoubleTap = ({ threshold = 300, onDoubleTap, onSingleTap }: DoubleTapOptions) => {
  const lastTapRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < threshold) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      onDoubleTap();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      if (onSingleTap) {
        timerRef.current = setTimeout(() => {
          onSingleTap();
          timerRef.current = null;
        }, threshold);
      }
    }
  }, [threshold, onDoubleTap, onSingleTap]);
};
