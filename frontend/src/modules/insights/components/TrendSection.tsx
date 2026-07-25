
import { InsightTrendPoint } from '../api/dto';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendSectionProps {
  trends: InsightTrendPoint[];
}

export function TrendSection({ trends }: TrendSectionProps) {
  if (trends.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-64 text-gray-500">
        No trend data available for this period.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Money In vs Money Out</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trends} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6B7280'}} tickLine={false} axisLine={false} dy={10} />
            <YAxis tick={{fontSize: 12, fill: '#6B7280'}} tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => `$${val}`} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Line type="monotone" name="Sales" dataKey="salesTotal" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            <Line type="monotone" name="Expenses" dataKey="expenseTotal" stroke="#EF4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
