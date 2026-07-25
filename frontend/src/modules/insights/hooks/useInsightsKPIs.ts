import { useState, useEffect, useCallback } from 'react';
import { insightsService } from '../services/insightsService';
import { InsightKPI, InsightRange } from '../api/dto';

export function useInsightsKPIs(initialRange?: InsightRange) {
  const [kpis, setKpis] = useState<InsightKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [range, setRange] = useState<InsightRange | undefined>(initialRange);

  const fetchKPIs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await insightsService.getInsightsKPIs(range);
      setKpis(response.kpis);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error fetching KPIs'));
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs]);

  return { kpis, loading, error, range, setRange, refresh: fetchKPIs };
}
