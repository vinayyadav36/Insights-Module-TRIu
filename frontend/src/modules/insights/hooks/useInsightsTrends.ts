import { useState, useEffect, useCallback } from 'react';
import { insightsService } from '../services/insightsService';
import { InsightTrendPoint, InsightRange } from '../api/dto';

export function useInsightsTrends(initialRange?: InsightRange) {
  const [trends, setTrends] = useState<InsightTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [range, setRange] = useState<InsightRange | undefined>(initialRange);

  const fetchTrends = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await insightsService.getInsightsTrends(range);
      setTrends(response.trends);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error fetching trends'));
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  return { trends, loading, error, range, setRange, refresh: fetchTrends };
}
