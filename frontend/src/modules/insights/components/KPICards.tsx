
import { InsightKPI } from '../api/dto';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPICardsProps {
  kpis: InsightKPI[];
}

export function KPICards({ kpis }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.key} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="text-sm text-gray-500 font-medium mb-1">{kpi.label}</div>
          <div className="text-2xl font-semibold text-gray-900">{kpi.formattedValue}</div>

          <div className="mt-2 flex items-center text-xs">
            {kpi.trendDirection === 'up' && (
              <span className="text-green-600 flex items-center bg-green-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight size={14} className="mr-1" />
                Positive
              </span>
            )}
            {kpi.trendDirection === 'down' && (
              <span className="text-red-600 flex items-center bg-red-50 px-1.5 py-0.5 rounded">
                <ArrowDownRight size={14} className="mr-1" />
                Negative
              </span>
            )}
            {kpi.trendDirection === 'flat' && (
              <span className="text-gray-500 flex items-center bg-gray-50 px-1.5 py-0.5 rounded">
                <Minus size={14} className="mr-1" />
                Flat
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
