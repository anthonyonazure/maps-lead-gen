import { DollarSign } from 'lucide-react';

interface CostTrackerProps {
  sessionCost: number;
  searchCount: number;
  lastSearchCost?: number;
}

const MONTHLY_CREDIT = 200;

export function CostTracker({ sessionCost, searchCount, lastSearchCost }: CostTrackerProps) {
  if (searchCount === 0) return null;

  const remaining = MONTHLY_CREDIT - sessionCost;
  const costColor = sessionCost > 150 ? 'text-red-600' : sessionCost > 100 ? 'text-amber-600' : 'text-emerald-600';

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 ${costColor}`}>
        <DollarSign className="h-3.5 w-3.5" />
        <span className="font-semibold">${sessionCost.toFixed(3)}</span>
        <span className="text-slate-400 font-normal">this session</span>
      </div>
      {lastSearchCost !== undefined && (
        <span className="text-slate-400 hidden sm:inline">
          last: ${lastSearchCost.toFixed(3)}
        </span>
      )}
      <span className="text-slate-400 hidden md:inline">
        ~${remaining.toFixed(0)} credit left
      </span>
    </div>
  );
}
