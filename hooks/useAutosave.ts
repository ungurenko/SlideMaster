import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAutosaveOptions<T> {
  data: T;
  onSave: (data: T) => void;
  delay?: number;
  enabled?: boolean;
}

export function useAutosave<T>({
  data,
  onSave,
  delay = 5000,
  enabled = true,
}: UseAutosaveOptions<T>) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const previousDataRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Serialize data for comparison
  const serializedData = JSON.stringify(data);

  // Detect changes
  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousDataRef.current = serializedData;
      return;
    }

    // Check if data actually changed
    if (serializedData !== previousDataRef.current) {
      previousDataRef.current = serializedData;
      setHasUnsavedChanges(true);
    }
  }, [serializedData]);

  // Autosave logic
  useEffect(() => {
    if (!enabled || !hasUnsavedChanges) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        onSave(data);
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        toast.success('Автосохранено', {
          duration: 2000,
          icon: '✓',
        });
      } catch (error) {
        toast.error('Не удалось сохранить');
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, hasUnsavedChanges, delay, enabled, onSave]);

  // Manual save
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      onSave(data);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      toast.success('Сохранено', {
        duration: 2000,
        icon: '✓',
      });
    } catch (error) {
      toast.error('Не удалось сохранить');
    }
  }, [data, onSave]);

  // Mark as changed manually
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  return {
    hasUnsavedChanges,
    lastSaved,
    saveNow,
    markAsChanged,
  };
}
