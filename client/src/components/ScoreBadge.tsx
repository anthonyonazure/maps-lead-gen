interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  let bg: string, text: string, label: string;

  if (score >= 70) {
    bg = 'bg-green-100 border-green-300'; text = 'text-green-800'; label = 'Hot';
  } else if (score >= 40) {
    bg = 'bg-amber-100 border-amber-300'; text = 'text-amber-800'; label = 'Warm';
  } else {
    bg = 'bg-slate-100 border-slate-300'; text = 'text-slate-600'; label = 'Low';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${bg} ${text}`}>
      {score}
      <span className="opacity-70">{label}</span>
    </span>
  );
}
