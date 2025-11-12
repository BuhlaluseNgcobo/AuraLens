import React from 'react';

interface ProgressIndicatorProps {
  processed: number;
  total: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ processed, total }) => {
  if (total === 0) return null;

  const percentage = total > 0 ? (processed / total) * 100 : 0;

  return (
    <div 
      className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 space-y-3"
      role="status" 
      aria-live="polite"
      aria-label={`Analysis in progress. ${processed} of ${total} items complete.`}
    >
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Analyzing Batch...</p>
        <p className="text-sm font-semibold text-rose-600 dark:text-sky-400">{`${processed} / ${total}`}</p>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-sky-500 to-rose-500 dark:from-sky-400 dark:to-blue-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
