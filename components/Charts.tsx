
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AnalysisResult, Sentiment } from '../types';

interface ChartsProps {
  dataA: AnalysisResult[];
  dataB?: AnalysisResult[];
  theme: 'light' | 'dark';
}

const COLORS = {
  [Sentiment.Positive]: '#22c55e', // green-500
  [Sentiment.Negative]: '#ef4444', // red-500
  [Sentiment.Neutral]: '#64748b',  // slate-500
  [Sentiment.Error]: '#a0a0a0',
};

const renderEmptyState = () => (
    <div className="flex items-center justify-center h-full min-h-[300px] text-slate-500 dark:text-slate-400">
        <p>No data to visualize.</p>
    </div>
);

const renderPieChart = (data: AnalysisResult[], title: string, theme: 'light' | 'dark') => {
    const isDark = theme === 'dark';
    const tooltipStyle = {
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
      borderRadius: '0.5rem',
      color: isDark ? '#cbd5e1' : '#1e293b'
    };
    const legendStyle = { color: isDark ? '#94a3b8' : '#475569' };

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">{title}</h3>
                {renderEmptyState()}
            </div>
        );
    }

    const sentimentCounts = data.reduce((acc, curr) => {
        acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
        return acc;
    }, {} as Record<Sentiment, number>);

    const pieData = Object.entries(sentimentCounts).map(([name, value]) => ({ name, value }));

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as Sentiment]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: tooltipStyle.color }} />
                    <Legend wrapperStyle={legendStyle} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};


const Charts: React.FC<ChartsProps> = ({ dataA, dataB, theme }) => {
    const isDark = theme === 'dark';

    const tooltipStyle = {
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
        borderRadius: '0.5rem',
    };
    const tooltipTextStyle = { color: isDark ? '#cbd5e1' : '#1e293b' };
    const gridStroke = isDark ? '#475569' : '#e2e8f0';
    const tickFill = isDark ? '#94a3b8' : '#475569';

    const getAvgConfidenceData = (data: AnalysisResult[]) => {
        return Object.values(Sentiment).filter(s => s !== Sentiment.Error).map(sentiment => {
            const sentimentData = data.filter(d => d.sentiment === sentiment);
            return sentimentData.length > 0
                ? sentimentData.reduce((sum, item) => sum + item.confidence, 0) / sentimentData.length
                : 0;
        });
    }
    
    const avgConfidenceData = Object.values(Sentiment).filter(s => s !== Sentiment.Error).map((sentiment, i) => {
        const avgA = getAvgConfidenceData(dataA);
        const avgB = dataB ? getAvgConfidenceData(dataB) : [];
        return {
            name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
            'Source A': avgA[i],
            ...(dataB && { 'Source B': avgB[i] }),
        };
    });

    const hasData = dataA.length > 0 || (dataB && dataB.length > 0);


  if (!dataB) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderPieChart(dataA, "Sentiment Distribution", theme)}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">Average Confidence</h3>
                {dataA.length === 0 ? renderEmptyState() : (
                    <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={avgConfidenceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                        <XAxis dataKey="name" tick={{ fill: tickFill }} />
                        <YAxis domain={[0, 1]} tick={{ fill: tickFill }}/>
                        <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipTextStyle} />
                        <Legend wrapperStyle={{ color: tickFill }}/>
                        <Bar dataKey="Source A">
                            {avgConfidenceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as Sentiment]} />
                            ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderPieChart(dataA, "Source A: Sentiment Distribution", theme)}
            {renderPieChart(dataB, "Source B: Sentiment Distribution", theme)}
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">Average Confidence Comparison</h3>
            {!hasData ? renderEmptyState() : (
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={avgConfidenceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="name" tick={{ fill: tickFill }} />
                    <YAxis domain={[0, 1]} tick={{ fill: tickFill }}/>
                    <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipTextStyle} />
                    <Legend wrapperStyle={{ color: tickFill }}/>
                    <Bar dataKey="Source A" fill="#38bdf8" />
                    <Bar dataKey="Source B" fill="#f472b6" />
                </BarChart>
                </ResponsiveContainer>
            )}
      </div>
    </div>
  );
};

export default Charts;
