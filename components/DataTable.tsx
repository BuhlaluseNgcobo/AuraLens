import React from 'react';
import { AnalysisResult, Sentiment } from '../types';

interface DataTableProps {
  data: AnalysisResult[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const showSourceColumn = data.length > 0 && !!data[0].source;

  const sentimentStyles: Record<Sentiment, string> = {
    [Sentiment.Positive]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [Sentiment.Negative]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    [Sentiment.Neutral]: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
    [Sentiment.Error]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 mt-8">
       <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Detailed Results</h3>
       <div className="overflow-x-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-slate-100 dark:bg-slate-900 sticky top-0">
            <tr>
              {showSourceColumn && <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-rose-900/60 dark:text-sky-300/70 uppercase tracking-wider">Source</th>}
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-rose-900/60 dark:text-sky-300/70 uppercase tracking-wider">Text</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-rose-900/60 dark:text-sky-300/70 uppercase tracking-wider">Sentiment</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-rose-900/60 dark:text-sky-300/70 uppercase tracking-wider">Confidence</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-rose-900/60 dark:text-sky-300/70 uppercase tracking-wider">Keywords</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-rose-900/60 dark:text-sky-300/70 uppercase tracking-wider">Explanation</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {data.length === 0 ? (
              <tr>
                <td colSpan={showSourceColumn ? 7 : 6} className="text-center py-10 text-slate-500 dark:text-slate-400">
                  No data to display.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index}>
                  {showSourceColumn && <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700 dark:text-slate-300">{item.source}</td>}
                  <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700 dark:text-slate-300 max-w-xs">{item.text}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sentimentStyles[item.sentiment]}`}>
                      {item.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{(item.confidence * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 max-w-xs">{item.keywords.join(', ')}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 dark:text-slate-400 max-w-xs">{item.explanation}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;