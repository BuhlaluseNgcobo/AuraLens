import React, { useState, useCallback, useEffect } from 'react';
import { InputMethod, MAX_BATCH_SIZE, MAX_FILE_SIZE_MB, MAX_TEXT_INPUT_LENGTH } from '../types';
import Spinner from './Spinner';

interface InputAreaProps {
  inputMethod: InputMethod;
  onAnalyze: (data: { sourceA: string[]; sourceB: string[] }) => void;
  isLoading: boolean;
  isComparison: boolean;
  isApiConfigured: boolean;
}

type InputState = {
    text: string;
    file: File | null;
    fileName: string;
    csvHeaders: string[];
    selectedColumn: string;
}

const initialState: InputState = {
    text: '',
    file: null,
    fileName: '',
    csvHeaders: [],
    selectedColumn: ''
};

const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const InputArea: React.FC<InputAreaProps> = ({ inputMethod, onAnalyze, isLoading, isComparison, isApiConfigured }) => {
  const [sourceA, setSourceA] = useState<InputState>(initialState);
  const [sourceB, setSourceB] = useState<InputState>(initialState);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);

  // Reset state and errors when input method or comparison mode changes
  useEffect(() => {
    setSourceA(initialState);
    setSourceB(initialState);
    setErrorA(null);
    setErrorB(null);
  }, [inputMethod, isComparison]);


  const validateText = (value: string, source: 'A' | 'B') => {
      const setSource = source === 'A' ? setSourceA : setSourceB;
      const setError = source === 'A' ? setErrorA : setErrorB;
      
      setSource(prev => ({...prev, text: value, file: null, fileName: ''}));

      if (value.length > MAX_TEXT_INPUT_LENGTH) {
          setError(`Text exceeds the ${MAX_TEXT_INPUT_LENGTH.toLocaleString()}-character limit.`);
          return;
      }
      
      const lineCount = value.split('\n').filter(Boolean).length;
      if (lineCount > MAX_BATCH_SIZE) {
          setError(`Batch size exceeds the ${MAX_BATCH_SIZE}-entry limit.`);
          return;
      }
      
      setError(null);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, source: 'A' | 'B') => {
    const selectedFile = e.target.files?.[0];
    const setSource = source === 'A' ? setSourceA : setSourceB;
    const setError = source === 'A' ? setErrorA : setErrorB;

    if (selectedFile) {
        if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
            setError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
            e.target.value = ''; // Reset file input
            return;
        }

        setError(null);
        setSource(prev => ({ ...prev, text: '', file: selectedFile, fileName: selectedFile.name, csvHeaders: [], selectedColumn: '' }));
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target?.result as string;
            const lines = fileContent.split('\n').filter(Boolean);
            
            if (lines.length > MAX_BATCH_SIZE) {
                setError(`File contains more than the maximum of ${MAX_BATCH_SIZE} entries.`);
                setSource(prev => ({ ...prev, file: null, fileName: ''})); // Invalidate file
                return;
            }

            if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
                const firstLine = lines[0] || '';
                const headers = firstLine.split(',').map(h => h.trim().replace(/"/g, ''));
                setSource(prev => ({ ...prev, csvHeaders: headers }));
            }
        };
        reader.readAsText(selectedFile);
    }
  };
  
  const getTextsFromFile = (file: File, selectedColumn: string, headers: string[]): Promise<string[]> => {
      return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                if (inputMethod === InputMethod.TXT) {
                    resolve(content.split('\n').map(l => l.trim()).filter(Boolean));
                } else if (inputMethod === InputMethod.CSV) {
                    const rows = content.split('\n').slice(1);
                    const colIndex = headers.indexOf(selectedColumn);
                    if (colIndex > -1) {
                       const texts = rows.map(row => {
                           const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // handle commas inside quotes
                           return columns[colIndex]?.trim().replace(/"/g, '') || '';
                       }).filter(Boolean);
                       resolve(texts);
                    } else {
                        resolve([]);
                    }
                }
            };
            reader.readAsText(file);
      });
  }

  const handleAnalyzeClick = async () => {
    let textsA: string[] = [];
    let textsB: string[] = [];

    // Process Source A
    if (inputMethod === InputMethod.Single || inputMethod === InputMethod.Batch) {
        textsA = sourceA.text.split('\n').map(l => l.trim()).filter(Boolean);
    } else if (sourceA.file) {
        textsA = await getTextsFromFile(sourceA.file, sourceA.selectedColumn, sourceA.csvHeaders);
    }

    // Process Source B if in comparison mode
    if (isComparison) {
        if (inputMethod === InputMethod.Single || inputMethod === InputMethod.Batch) {
            textsB = sourceB.text.split('\n').map(l => l.trim()).filter(Boolean);
        } else if (sourceB.file) {
            textsB = await getTextsFromFile(sourceB.file, sourceB.selectedColumn, sourceB.csvHeaders);
        }
    }
    
    if(textsA.length > 0 || textsB.length > 0) {
        onAnalyze({ sourceA: textsA, sourceB: textsB });
    }
  };
  
  const hasValidInput = (state: InputState) => {
    if (inputMethod === InputMethod.Single || inputMethod === InputMethod.Batch) {
        return state.text.trim().length > 0;
    }
    if (inputMethod === InputMethod.TXT) {
        return !!state.file;
    }
    if (inputMethod === InputMethod.CSV) {
        return !!state.file && !!state.selectedColumn;
    }
    return false;
  }

  const renderInputSource = (source: 'A' | 'B') => {
    const state = source === 'A' ? sourceA : sourceB;
    const setState = source === 'A' ? setSourceA : setSourceB;
    const error = source === 'A' ? errorA : errorB;

    const renderError = (message: string | null) => message && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
            {message}
        </div>
    );

    switch (inputMethod) {
      case InputMethod.Single:
      case InputMethod.Batch:
        return (
            <div>
                <textarea 
                    value={state.text} 
                    onChange={(e) => validateText(e.target.value, source)} 
                    placeholder={inputMethod === InputMethod.Single ? "Enter text..." : "Paste multiple lines..."}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-shadow bg-white dark:bg-slate-700 dark:text-slate-200 ${error ? 'border-red-500 ring-red-300' : 'border-slate-200 dark:border-slate-600 focus:ring-rose-500 dark:focus:ring-sky-500'} ${inputMethod === InputMethod.Single ? 'h-40' : 'h-64'}`} 
                />
                {renderError(error)}
            </div>
        );
      case InputMethod.TXT:
      case InputMethod.CSV:
        return (
          <div className="w-full">
            <label className={`w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-slate-700 text-rose-600 dark:text-sky-400 rounded-lg shadow-md tracking-wide uppercase border cursor-pointer hover:bg-rose-50 dark:hover:bg-slate-600 hover:text-rose-700 dark:hover:text-sky-300 ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'}`}>
              <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3v-4h2v4z" />
              </svg>
              <span className="mt-2 text-base leading-normal">{state.fileName || `Select a ${inputMethod === InputMethod.TXT ? '.txt' : '.csv'} file`}</span>
              <input type='file' className="hidden" onChange={(e) => handleFileChange(e, source)} accept={inputMethod === InputMethod.TXT ? '.txt' : '.csv'} />
            </label>
            {inputMethod === InputMethod.CSV && state.csvHeaders.length > 0 && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Select text column:</label>
                    <select value={state.selectedColumn} onChange={e => setState(p => ({...p, selectedColumn: e.target.value}))} className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 dark:focus:ring-sky-500 focus:outline-none">
                        <option value="">-- Choose a column --</option>
                        {state.csvHeaders.map(header => <option key={header} value={header}>{header}</option>)}
                    </select>
                </div>
            )}
            {renderError(error)}
          </div>
        );
      default:
        return null;
    }
  };

  const isButtonDisabled = isLoading || !isApiConfigured || !!errorA || !!errorB ||
    (isComparison ? !hasValidInput(sourceA) && !hasValidInput(sourceB) : !hasValidInput(sourceA));
  const buttonTooltip = !isApiConfigured ? 'Analysis is disabled because the Gemini API key is not configured.' : '';

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">{isComparison ? 'Source A' : `${inputMethod} Analysis`}</h2>
        {renderInputSource('A')}
      </div>
      {isComparison && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Source B</h2>
            {renderInputSource('B')}
          </div>
      )}
      <button
        onClick={handleAnalyzeClick}
        disabled={isButtonDisabled}
        title={buttonTooltip}
        className="w-full flex justify-center items-center bg-gradient-to-r from-sky-500 to-rose-500 text-white font-bold py-3 px-4 rounded-lg hover:from-sky-600 hover:to-rose-600 transition-all duration-300 shadow-lg disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:shadow-inner dark:disabled:from-slate-600 dark:disabled:to-slate-700"
      >
        {isLoading ? <Spinner /> : 'Analyze'}
      </button>
    </div>
  );
};

export default InputArea;