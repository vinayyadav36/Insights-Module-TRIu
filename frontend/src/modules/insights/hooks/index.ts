import { useState, useCallback, useEffect } from 'react';
import { insightsService } from '../services/insightsService';
import {
  InsightsOverviewDTO,
  CategoryBreakdownItemDTO,
  PaymentModeMixDTO,
  TrendPointDTO,
  PartySpendItemDTO,
  AnomalyItemDTO,
  InsightsFilterDTO
} from '../api/dto';

export function useInsightsFilter(initial: InsightsFilterDTO = {}) {
  const [filter, setFilter] = useState<InsightsFilterDTO>(() => {
    return applyPreset(initial);
  });

  const updateFilter = useCallback((update: Partial<InsightsFilterDTO>) => {
    setFilter(prev => {
      const next = { ...prev, ...update };
      if (update.preset && update.preset !== 'custom') {
         return applyPreset(next);
      }
      return next;
    });
  }, []);

  return { filter, updateFilter, setFilter };
}

function applyPreset(filter: InsightsFilterDTO): InsightsFilterDTO {
  const now = new Date();

  if (filter.preset === 'today') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { ...filter, rangeStart: start.toISOString(), rangeEnd: end.toISOString() };
  }

  if (filter.preset === 'week') {
    const start = new Date(now);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { ...filter, rangeStart: start.toISOString(), rangeEnd: end.toISOString() };
  }

  if (filter.preset === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { ...filter, rangeStart: start.toISOString(), rangeEnd: end.toISOString() };
  }

  return filter;
}

export function useInsightsOverview(filter: InsightsFilterDTO) {
  const [data, setData] = useState<InsightsOverviewDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    const handleFocus = () => setRefetchIndex(i => i + 1);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    insightsService.getOverview(filter)
      .then(res => { if (active) setData(res); })
      .catch(err => { if (active) setError(err); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filter, refetchIndex]);

  return { data, loading, error };
}

export function useCategoryBreakdown(filter: InsightsFilterDTO) {
  const [data, setData] = useState<CategoryBreakdownItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    const handleFocus = () => setRefetchIndex(i => i + 1);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    insightsService.getCategoryBreakdown(filter)
      .then(res => { if (active) setData(res); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filter, refetchIndex]);

  return { data, loading };
}

export function usePaymentModeMix(filter: InsightsFilterDTO) {
  const [data, setData] = useState<PaymentModeMixDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    const handleFocus = () => setRefetchIndex(i => i + 1);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    insightsService.getPaymentModeMix(filter)
      .then(res => { if (active) setData(res); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filter, refetchIndex]);

  return { data, loading };
}

export function useInsightsTrend(filter: InsightsFilterDTO, bucket: 'day' | 'week' | 'month' = 'day') {
  const [data, setData] = useState<TrendPointDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    const handleFocus = () => setRefetchIndex(i => i + 1);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    insightsService.getTrend(filter, bucket)
      .then(res => { if (active) setData(res); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filter, bucket, refetchIndex]);

  return { data, loading };
}

export function usePartySpend(filter: InsightsFilterDTO) {
  const [data, setData] = useState<PartySpendItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    const handleFocus = () => setRefetchIndex(i => i + 1);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    insightsService.getPartySpend(filter)
      .then(res => { if (active) setData(res); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filter, refetchIndex]);

  return { data, loading };
}

export function useAnomalies(filter: InsightsFilterDTO) {
  const [data, setData] = useState<AnomalyItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    const handleFocus = () => setRefetchIndex(i => i + 1);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    insightsService.getAnomalies(filter)
      .then(res => { if (active) setData(res); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filter, refetchIndex]);

  return { data, loading };
}

export function useInsightsExport() {
  const [exporting, setExporting] = useState(false);

  const exportData = useCallback(async (filter: InsightsFilterDTO) => {
    setExporting(true);
    try {
      const data = await insightsService.exportInsightsSummary(filter);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `insights-export-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, []);

  return { exportData, exporting };
}
