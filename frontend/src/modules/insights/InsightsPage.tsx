
import { useInsightsOverview } from './hooks/useInsightsOverview';
import { KPICards } from './components/KPICards';
import { TrendSection } from './components/TrendSection';
import { TopList } from './components/TopList';
import { CashflowSummaryCard } from './components/CashflowSummaryCard';
import { CreditSummaryCard } from './components/CreditSummaryCard';
import { RangeSelector } from './components/RangeSelector';
import { BarChart3 } from 'lucide-react';

export function InsightsPage() {
  const { data, loading, error, range, setRange } = useInsightsOverview({
    preset: '30d',
    startDate: '', // handled by service/mock
    endDate: ''
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-red-500">
        Error loading insights: {error.message}
      </div>
    );
  }

  if (!data) return null;

  const hasData = data.kpis.some((kpi: any) => kpi.value !== 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="mr-2 text-indigo-600" />
              Business Insights
            </h1>
            <p className="text-gray-500 text-sm mt-1">Overview of your financial performance and trends</p>
          </div>
          <RangeSelector range={range} onChange={setRange} />
        </div>

        {!hasData ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Insights will populate automatically once you start recording sales and expenses.
            </p>
          </div>
        ) : (
          <>
            <KPICards kpis={data.kpis} />

            <TrendSection trends={data.trends} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TopList
                title="Top Selling Items"
                items={data.topItems}
                emptyMessage="No item sales recorded."
              />
              <TopList
                title="Top Customers"
                items={data.topParties}
                emptyMessage="No customer sales recorded."
              />
              <TopList
                title="Top Expense Categories"
                items={data.topCategories}
                emptyMessage="No expenses recorded."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <CashflowSummaryCard cashflow={data.cashflow} />
               <CreditSummaryCard credit={data.credit} />
            </div>
          </>
        )}

      </div>
    </div>
  );
}
