import { useState, useEffect } from 'react';
import { Team } from '../types';
import { fetchTeams } from '../api/client';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTeams()
      .then((data) => {
        if (!cancelled) {
          setTeams(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load teams');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { teams, loading, error };
}
