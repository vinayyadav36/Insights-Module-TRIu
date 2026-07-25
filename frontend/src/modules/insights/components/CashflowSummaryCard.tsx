
import { CashflowSummaryResponse } from '../api/dto';
import { ArrowDownToLine, ArrowUpFromLine, Activity } from 'lucide-react';

interface CashflowSummaryCardProps {
  cashflow: CashflowSummaryResponse;
}

export function CashflowSummaryCard({ cashflow }: CashflowSummaryCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <Activity className="text-blue-500" size={20} />
        <h3 className="text-lg font-medium text-gray-900">Cashflow Summary</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-gray-600">
            <ArrowDownToLine size={16} className="mr-2 text-green-500" />
            <span className="text-sm font-medium">Total Incoming</span>
          </div>
          <span className="font-semibold text-gray-900">{cashflow.formattedIncoming}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-gray-600">
            <ArrowUpFromLine size={16} className="mr-2 text-red-500" />
            <span className="text-sm font-medium">Total Outgoing</span>
          </div>
          <span className="font-semibold text-gray-900">{cashflow.formattedOutgoing}</span>
        </div>

        <div className="flex items-center justify-between p-3 border-t border-gray-100 pt-4 mt-2">
          <span className="text-sm font-medium text-gray-900">Net Cash Position</span>
          <span className={`text-lg font-bold ${cashflow.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {cashflow.formattedNet}
          </span>
        </div>
      </div>
    </div>
  );
}
