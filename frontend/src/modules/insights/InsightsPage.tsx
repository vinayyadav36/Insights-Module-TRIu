import { useState } from 'react';
import { useInsightsFilter, useInsightsOverview, useCategoryBreakdown, usePaymentModeMix, useInsightsTrend, usePartySpend, useAnomalies, useInsightsExport } from './hooks';
import { formatCurrency } from '../../shared/utils/currencyUtils';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

export function InsightsPage() {
  const { filter, updateFilter } = useInsightsFilter({ preset: 'month' });
  const [trendBucket, setTrendBucket] = useState<'day' | 'week' | 'month'>('day');

  const { data: overview, loading: loadingOverview } = useInsightsOverview(filter);
  const { data: categories } = useCategoryBreakdown(filter);
  const { data: paymentModes } = usePaymentModeMix(filter);
  const { data: trends } = useInsightsTrend(filter, trendBucket);
  const { data: partySpends } = usePartySpend(filter);
  const { data: anomalies } = useAnomalies(filter);
  const { exportData, exporting } = useInsightsExport();

  if (loadingOverview) {
    return <div className="p-8">Loading insights...</div>;
  }

  if (!overview) {
    return <div className="p-8">Failed to load insights.</div>;
  }

  const hasData = overview.transactionCount > 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Business Insights</h1>
        <div className="flex gap-4 flex-wrap items-center">
          <select
            value={filter.preset || 'custom'}
            onChange={e => updateFilter({ preset: e.target.value as any })}
            className="border rounded p-2"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom</option>
          </select>
          {filter.preset === 'custom' && (
            <div className="flex gap-2 items-center">
               <input type="date" value={filter.rangeStart ? filter.rangeStart.split('T')[0] : ''} onChange={e => updateFilter({ rangeStart: e.target.value ? new Date(e.target.value).toISOString() : undefined })} className="border rounded p-2" />
               <span>to</span>
               <input type="date" value={filter.rangeEnd ? filter.rangeEnd.split('T')[0] : ''} onChange={e => {
                  if (e.target.value) {
                     const end = new Date(e.target.value);
                     end.setHours(23, 59, 59, 999);
                     updateFilter({ rangeEnd: end.toISOString() });
                  } else {
                     updateFilter({ rangeEnd: undefined });
                  }
               }} className="border rounded p-2" />
            </div>
          )}
          <button
            onClick={() => exportData(filter)}
            disabled={exporting}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {exporting ? 'Exporting...' : 'Export JSON'}
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="p-12 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No data available for this range.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 border rounded shadow-sm">
              <h3 className="text-sm text-gray-500">Total Spend</h3>
              <p className="text-2xl font-bold">{formatCurrency(overview.totalSpend)}</p>
            </div>
            <div className="bg-white p-4 border rounded shadow-sm">
              <h3 className="text-sm text-gray-500">Transactions</h3>
              <p className="text-2xl font-bold">{overview.transactionCount}</p>
            </div>
            <div className="bg-white p-4 border rounded shadow-sm">
              <h3 className="text-sm text-gray-500">Avg Daily Spend</h3>
              <p className="text-2xl font-bold">{formatCurrency(overview.avgDailySpend)}</p>
            </div>
            <div className="bg-white p-4 border rounded shadow-sm">
              <h3 className="text-sm text-gray-500">Top Category</h3>
              <p className="text-2xl font-bold">{overview.topCategory?.name || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-4 border rounded shadow-sm">
              <h3 className="font-bold mb-4">Category Breakdown</h3>
              <ul className="space-y-2">
                {categories.map(c => (
                  <li key={c.categoryId} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <a href={`/expenses?categoryId=${c.categoryId}`} className="text-blue-600 hover:underline">
                      {c.categoryName}
                    </a>
                    <span>{formatCurrency(c.total)} ({c.percentOfTotal.toFixed(1)}%)</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 border rounded shadow-sm flex flex-col">
              <h3 className="font-bold mb-4">Payment Modes</h3>
              <div className="flex-1 min-h-[250px]">
                {paymentModes.some(p => p.total > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={paymentModes.filter(p => p.total > 0)} dataKey="total" nameKey="mode" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label={({ mode }) => mode}>
                         {paymentModes.filter(p => p.total > 0).map((_entry, index) => {
                            const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                         })}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">No data</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-4 border rounded shadow-sm">
              <h3 className="font-bold mb-4">Top Parties</h3>
              <ul className="space-y-2">
                {partySpends.slice(0, 5).map(p => (
                  <li key={p.partyId} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                     <a href={`/parties/${p.partyId}`} className="text-blue-600 hover:underline">
                       {p.partyName}
                     </a>
                     <span>{formatCurrency(p.total)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 border rounded shadow-sm">
              <h3 className="font-bold mb-4 text-red-600">Anomalies</h3>
              <ul className="space-y-2">
                {anomalies.length === 0 ? (
                  <li className="text-gray-500">No anomalies detected.</li>
                ) : (
                  anomalies.slice(0, 5).map(a => (
                    <li key={a.expenseId} className="flex flex-col p-2 bg-red-50 rounded">
                       <div className="flex justify-between">
                         <a href={`/expenses/${a.expenseId}`} className="text-blue-600 hover:underline font-medium">
                           {a.categoryName} Spike
                         </a>
                         <span className="font-bold text-red-700">{formatCurrency(a.amount)}</span>
                       </div>
                       <span className="text-xs text-red-500">{a.percentAboveAverage.toFixed(0)}% above category average ({formatCurrency(a.averageForCategory)})</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="bg-white p-4 border rounded shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold">Spend Trend</h3>
               <select className="border rounded p-1 text-sm" value={trendBucket} onChange={e => setTrendBucket(e.target.value as any)}>
                 <option value="day">Daily</option>
                 <option value="week">Weekly</option>
                 <option value="month">Monthly</option>
               </select>
            </div>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 {trendBucket === 'day' ? (
                   <LineChart data={trends}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                     <YAxis tickFormatter={(val) => `₹${val}`} width={80} />
                     <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                     <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={false} />
                   </LineChart>
                 ) : (
                   <BarChart data={trends}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                     <YAxis tickFormatter={(val) => `₹${val}`} width={80} />
                     <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                     <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 )}
               </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
