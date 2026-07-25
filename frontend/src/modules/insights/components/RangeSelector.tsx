
import { InsightRange } from '../api/dto';

interface RangeSelectorProps {
  range?: InsightRange;
  onChange: (range: InsightRange) => void;
}

export function RangeSelector({ range, onChange }: RangeSelectorProps) {
  const currentPreset = range?.preset || '30d';

  const presets = [
    { value: 'today', label: 'Today' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ] as const;

  const handleSelect = (preset: typeof presets[number]['value']) => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    let startDate = '';

    if (preset === 'today') {
      startDate = endDate;
    } else if (preset === '7d') {
      const d = new Date(today);
      d.setDate(d.getDate() - 7);
      startDate = d.toISOString().split('T')[0];
    } else if (preset === '30d') {
      const d = new Date(today);
      d.setDate(d.getDate() - 30);
      startDate = d.toISOString().split('T')[0];
    } else if (preset === '90d') {
      const d = new Date(today);
      d.setDate(d.getDate() - 90);
      startDate = d.toISOString().split('T')[0];
    }

    onChange({
      preset,
      startDate,
      endDate
    });
  };

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg self-start">
      {presets.map(p => (
        <button
          key={p.value}
          onClick={() => handleSelect(p.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            currentPreset === p.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
