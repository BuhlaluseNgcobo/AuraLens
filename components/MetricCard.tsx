import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, delta }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
    <p className="text-sm text-gray-500 dark:text-slate-400">{title}</p>
    <div className="flex items-baseline space-x-2">
       <p className="text-3xl font-bold text-rose-600 dark:text-sky-400">{value}</p>
       {delta && <p className="text-sm text-gray-400 dark:text-slate-500">{delta}</p>}
    </div>
  </div>
);

export default MetricCard;
