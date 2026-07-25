import { useState, useEffect, useCallback } from 'react';
import { insightsService } from '../services/insightsService';
import { InsightsOverviewResponse, InsightRange } from '../api/dto';

export function useInsightsOverview(initialRange?: InsightRange) {
  const [data, setData] = useState<InsightsOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [range, setRange] = useState<InsightRange | undefined>(initialRange);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await insightsService.getInsightsOverview(range);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error fetching insights'));
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { data, loading, error, range, setRange, refresh: fetchOverview };
}
