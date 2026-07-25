
import { CreditSummaryResponse } from '../api/dto';
import { AlertCircle, Clock } from 'lucide-react';

interface CreditSummaryCardProps {
  credit: CreditSummaryResponse;
}

export function CreditSummaryCard({ credit }: CreditSummaryCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="text-orange-500" size={20} />
        <h3 className="text-lg font-medium text-gray-900">Outstanding Balances</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">To Receive (Customer Credit)</span>
            <span className="font-semibold text-green-600">{credit.formattedCustomerCredit}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">To Pay (Supplier Payable)</span>
            <span className="font-semibold text-red-600">{credit.formattedSupplierPayable}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-red-400 h-1.5 rounded-full" style={{ width: '30%' }}></div>
          </div>
        </div>

        {(credit.outstandingCustomerCredit > 0 || credit.supplierPayableExposure > 0) && (
          <div className="mt-4 flex items-start space-x-2 text-xs text-gray-500 bg-orange-50 p-3 rounded-lg border border-orange-100">
            <AlertCircle size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
            <p>Ensure timely follow-ups for customer credit to maintain a healthy cash position.</p>
          </div>
        )}
      </div>
    </div>
  );
}
