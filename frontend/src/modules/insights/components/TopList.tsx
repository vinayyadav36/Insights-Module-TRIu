
import { TopEntitySummary } from '../api/dto';

interface TopListProps {
  title: string;
  items: TopEntitySummary[];
  emptyMessage: string;
}

export function TopList({ title, items, emptyMessage }: TopListProps) {
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>

      {items.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-sm text-gray-500 py-6">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 truncate">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-900 truncate">{item.label}</span>
              </div>
              <div className="flex items-center space-x-4 flex-shrink-0">
                <span className="text-xs text-gray-500">{item.count} qty</span>
                <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
