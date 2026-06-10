import { useState, useEffect, useCallback } from 'react';
import { Shift } from '../types';
import { fetchShifts } from '../api/client';
import { format } from 'date-fns';

export function useShifts(teamId: string, start: Date, end: Date) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);
    setError(null);
    try {
      const startStr = format(start, "yyyy-MM-dd'T'00:00:00'Z'");
      const endStr = format(end, "yyyy-MM-dd'T'23:59:59'Z'");
      const data = await fetchShifts(teamId, startStr, endStr);
      setShifts(data.shifts);
      setScheduleEnabled(data.scheduleEnabled);
    } catch {
      setError('Failed to load shifts');
    } finally {
      setLoading(false);
    }
  }, [teamId, start, end]);

  useEffect(() => { load(); }, [load]);

  return { shifts, scheduleEnabled, loading, error, refresh: load };
}
