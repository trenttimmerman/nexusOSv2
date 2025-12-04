import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

declare const Chart: any;

const Analytics: React.FC = () => {
    const funnelChartRef = useRef<HTMLCanvasElement>(null);
    const funnelChartInstance = useRef<any>(null);

    const [kpis] = useState({
        aov: 198.45,
        conversionRate: 3.14,
        clv: 845.60
    });

    const [topProducts] = useState([
        { name: 'Quantum Smart Watch', unitsSold: 1204, revenue: 239996 },
        { name: 'Nova Wireless Earbuds', unitsSold: 987, revenue: 147063 },
        { name: 'Apex Pro Keyboard', unitsSold: 754, revenue: 112346 },
        { name: 'Zenith Gaming Mouse', unitsSold: 612, revenue: 48898 },
    ]);

    const [reportPeriod, setReportPeriod] = useState('Last 30 Days');
    const [aiReport, setAiReport] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    // Chart Initialization
    useEffect(() => {
        const initChart = () => {
             if (funnelChartRef.current && !funnelChartInstance.current && typeof Chart !== 'undefined') {
                const ctx = funnelChartRef.current.getContext('2d');
                if (ctx) {
                    funnelChartInstance.current = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Visitors', 'Added to Cart', 'Reached Checkout', 'Purchased'],
                            datasets: [{
                                label: 'Users',
                                data: [25430, 8950, 6120, 4890],
                                backgroundColor: [
                                    'rgba(167, 139, 250, 0.6)',
                                    'rgba(99, 102, 241, 0.6)',
                                    'rgba(6, 182, 212, 0.6)',
                                    'rgba(14, 165, 233, 0.6)'
                                ],
                                borderColor: [
                                    'rgba(167, 139, 250, 1)',
                                    'rgba(99, 102, 241, 1)',
                                    'rgba(6, 182, 212, 1)',
                                    'rgba(14, 165, 233, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            indexAxis: 'y',
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: { 
                                    backgroundColor: '#1f2937', 
                                    titleColor: '#e5e7eb', 
                                    bodyColor: '#d1d5db', 
                                    padding: 12, 
                                    cornerRadius: 6, 
                                    displayColors: false 
                                }
                            },
                            scales: {
                                x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } },
                                y: { grid: { display: false }, ticks: { color: '#9ca3af' } }
                            }
                        }
                    });
                }
            }
        };
        const intervalId = setInterval(() => {
            if (typeof Chart !== 'undefined') {
                initChart();
                clearInterval(intervalId);
            }
        }, 100);

        return () => clearInterval(intervalId);
    }, []);

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setError(null);
        setAiReport('');
        
        try {
            if (!process.env.API_KEY) {
                throw new Error("API key not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const mockSalesData = {
                period: reportPeriod,
                totalSales: 105234.56,
                totalOrders: 530,
                newCustomers: 152,
                topPerformingProduct: topProducts[0],
                salesTrend: "slight upward trend with a peak on weekends",
            };

            const prompt = `You are a senior data analyst for an e-commerce platform called Evolv. Your task is to write a detailed trend report based on the provided data.
            
            Data for: ${reportPeriod}
            ${JSON.stringify(mockSalesData, null, 2)}

            Based on this data, provide a concise but insightful report. The report should have:
            1. A main summary of performance.
            2. Two or three key observations or trends.
            3. One actionable recommendation for the store owner.
            
            Format the entire response using markdown. Use headings like "**Summary**" and bullet points for observations/recommendations.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setAiReport(response.text);

        } catch (err) {
            console.error("Error generating report:", err);
            const errorMessage = (err instanceof Error && err.message.includes("API key"))
                ? "AI features are unavailable due to a configuration issue."
                : "Failed to generate the report. Please try again later.";
            setError(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const renderReport = () => {
        if (isGenerating) {
            return (
                <div className="space-y-4 animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                     <div className="h-6 bg-gray-700 rounded w-1/4 mt-6"></div>
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                </div>
            );
        }
        if (error) {
            return <p className="text-red-400">{error}</p>;
        }
        if (!aiReport) {
            return <p className="text-gray-500">Your AI-generated trend report will appear here...</p>;
        }

        const lines = aiReport.split('\n').filter(line => line.trim() !== '');
        return (
             <div className="text-gray-300 space-y-2 prose prose-invert prose-p:my-1 prose-headings:my-2">
                {lines.map((line, index) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
                        return (
                            <div key={index} className="flex items-start">
                                <span className="text-cyan-400 mr-2 mt-1">•</span>
                                <span>{trimmedLine.substring(2)}</span>
                            </div>
                        );
                    }
                    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                        return <p key={index} className="font-semibold text-white mt-4 first:mt-0">{trimmedLine.slice(2, -2)}</p>;
                    }
                    return <p key={index}>{line}</p>;
                })}
            </div>
        )
    };

    return (
        <div className="fade-in-widget">
            <h1 className="text-3xl font-bold text-white mb-6">Analytics</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                 <div className="dash-glass-card rounded-2xl p-6">
                    <p className="text-sm text-gray-400 mb-2">Average Order Value</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(kpis.aov)}</p>
                </div>
                <div className="dash-glass-card rounded-2xl p-6">
                    <p className="text-sm text-gray-400 mb-2">Conversion Rate</p>
                    <p className="text-3xl font-bold text-white">{kpis.conversionRate}%</p>
                </div>
                <div className="dash-glass-card rounded-2xl p-6">
                    <p className="text-sm text-gray-400 mb-2">Customer Lifetime Value</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(kpis.clv)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 dash-glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Sales Funnel</h3>
                    <div className="h-80">
                         <canvas ref={funnelChartRef}></canvas>
                    </div>
                </div>
                <div className="lg:col-span-2 dash-glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Top Selling Products</h3>
                    <ul className="space-y-4">
                        {topProducts.map(product => (
                            <li key={product.name} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-white">{product.name}</p>
                                    <p className="text-sm text-gray-400">{product.unitsSold.toLocaleString()} units sold</p>
                                </div>
                                <p className="font-semibold text-cyan-400">{formatCurrency(product.revenue)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                
                 <div className="lg:col-span-5 dash-glass-card rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-purple-400"><path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V11.25l2.28 2.28a.75.75 0 0 1-1.06 1.06L11.25 13.062V15a.75.75 0 0 1-1.5 0v-3.75l-2.28 2.28a.75.75 0 1 1-1.06-1.06L8.25 11.25V7.5a.75.75 0 0 1 1.5 0Zm-2.822 8.72a.75.75 0 0 1 1.06 0l1.72 1.72V20.25h1.5v-2.25l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z" /></svg>
                            AI Trend Report
                        </h3>
                        <div className="flex items-center space-x-2">
                             <div className="flex items-center space-x-1 p-1 bg-gray-900/50 rounded-lg">
                                {['Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map(period => (
                                    <button key={period} onClick={() => setReportPeriod(period)} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${reportPeriod === period ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}>
                                        {period}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleGenerateReport} disabled={isGenerating} className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                {isGenerating ? 'Generating...' : 'Generate Report'}
                            </button>
                        </div>
                    </div>
                    <div className="bg-gray-900/50 p-6 rounded-lg min-h-[200px]">
                        {renderReport()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;