import React from 'react';
import { InputMethod } from '../types';

interface ControlsProps {
  selectedMethod: InputMethod;
  setSelectedMethod: (method: InputMethod) => void;
  isComparison: boolean;
  setIsComparison: (isComparison: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({ selectedMethod, setSelectedMethod, isComparison, setIsComparison }) => {
  
  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 w-full">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        {/* Input Options */}
        <div className="w-full sm:w-auto">
          <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider text-center sm:text-left">Input Method</h3>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(Object.values(InputMethod) as InputMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium flex-grow text-center
                  ${selectedMethod === method
                    ? 'bg-white text-rose-600 dark:bg-slate-700 dark:text-sky-400 shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
        
        {/* Divider */}
        <div className="hidden sm:block h-12 w-px bg-slate-200 dark:bg-slate-700"></div>

        {/* Analysis Mode */}
        <div className="w-full sm:w-auto">
          <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider text-center sm:text-left">Analysis Mode</h3>
          <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                  onClick={() => setIsComparison(false)}
                  className={`w-1/2 sm:w-auto px-4 py-2 text-sm font-medium rounded-md transition-colors ${!isComparison ? 'bg-white text-rose-600 dark:bg-slate-700 dark:text-sky-400 shadow' : 'text-slate-600 dark:text-slate-300'}`}
              >
                  Single
              </button>
              <button
                  onClick={() => setIsComparison(true)}
                  className={`w-1/2 sm:w-auto px-4 py-2 text-sm font-medium rounded-md transition-colors ${isComparison ? 'bg-white text-rose-600 dark:bg-slate-700 dark:text-sky-400 shadow' : 'text-slate-600 dark:text-slate-300'}`}
              >
                  Compare
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;