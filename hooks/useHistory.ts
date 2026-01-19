import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseHistoryOptions<T> {
  initialState: T;
  maxHistory?: number;
}

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>({ initialState, maxHistory = 50 }: UseHistoryOptions<T>) {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  // Throttle to avoid too many history entries
  const lastPushTime = useRef<number>(0);
  const THROTTLE_MS = 300;

  // Check if we can undo/redo
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // Push new state to history
  const push = useCallback((newState: T) => {
    const now = Date.now();

    // Throttle rapid changes
    if (now - lastPushTime.current < THROTTLE_MS) {
      // Just update present without adding to history
      setHistory(h => ({ ...h, present: newState }));
      return;
    }

    lastPushTime.current = now;

    setHistory(h => {
      const newPast = [...h.past, h.present].slice(-maxHistory);
      return {
        past: newPast,
        present: newState,
        future: [], // Clear future on new action
      };
    });
  }, [maxHistory]);

  // Undo
  const undo = useCallback(() => {
    setHistory(h => {
      if (h.past.length === 0) return h;

      const previous = h.past[h.past.length - 1];
      const newPast = h.past.slice(0, -1);

      toast('Отменено', {
        duration: 1500,
        icon: '↶',
      });

      return {
        past: newPast,
        present: previous,
        future: [h.present, ...h.future],
      };
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    setHistory(h => {
      if (h.future.length === 0) return h;

      const next = h.future[0];
      const newFuture = h.future.slice(1);

      toast('Повторено', {
        duration: 1500,
        icon: '↷',
      });

      return {
        past: [...h.past, h.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  // Reset history with new initial state
  const reset = useCallback((newInitialState: T) => {
    setHistory({
      past: [],
      present: newInitialState,
      future: [],
    });
  }, []);

  // Get current state
  const current = history.present;

  return {
    current,
    push,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    historyLength: history.past.length,
  };
}
