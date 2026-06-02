import { useCallback, useRef } from "react";

type UseLongPressOptions = {
  delay?: number;
  onLongPress: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
};

export function useLongPress({
  onLongPress,
  delay = 500,
  onPressStart,
  onPressEnd,
}: UseLongPressOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggeredRef = useRef(false);

  const start = useCallback(() => {
    triggeredRef.current = false;
    onPressStart?.();

    timeoutRef.current = setTimeout(() => {
      triggeredRef.current = true;
      onLongPress();
    }, delay);
  }, [delay, onLongPress, onPressStart]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    onPressEnd?.();
  }, [onPressEnd]);

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
  };
}
