import React from 'react';

// The execution environment provides API keys via process.env
const geminiKeyConfigured = !!process.env.API_KEY;

const ApiStatus: React.FC = () => {
  if (geminiKeyConfigured) {
    // If the key is configured, render nothing.
    return null;
  }

  // If the key is missing, show a clear warning message.
  return (
    <div className="bg-amber-100/80 dark:bg-amber-900/50 backdrop-blur-xl p-3 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800/60 w-full">
      <div className="flex justify-center items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.636-1.1 2.101-1.1 2.736 0l5.643 9.773c.636 1.1-.1 2.478-1.368 2.478H4.01c-1.267 0-2.004-1.378-1.368-2.478l5.615-9.773zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 010 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-center text-amber-800 dark:text-amber-300 font-medium">
            Gemini API key is not configured. Analysis is disabled.
        </p>
      </div>
    </div>
  );
};

export default ApiStatus;