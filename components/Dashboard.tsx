import React, { useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import Products from './Products';
import Orders from './Orders';
import Customers from './Customers';
import Analytics from './Analytics';
import Settings from './Settings';

declare const Chart: any;

interface Order {
    id: string;
    customer: string;
    total: number;
    status: 'Paid' | 'Pending' | 'Failed';
}

const initialOrders: Order[] = [
    { id: '#8A3F1', customer: 'Jenna Smith', total: 128.50, status: 'Paid' },
    { id: '#9C2B8', customer: 'Mark Johnson', total: 49.99, status: 'Pending' },
    { id: '#1D9E4', customer: 'Carlos Gomez', total: 219.00, status: 'Paid' },
    { id: '#5G6H0', customer: 'Aisha Khan', total: 87.20, status: 'Failed' },
];

const names = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia'];
const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
const statuses: Order['status'][] = ['Paid', 'Pending', 'Failed'];

const generateNewOrder = (): Order => {
    return {
        id: `#${Math.random().toString(16).substr(2, 5).toUpperCase()}`,
        customer: `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`,
        total: parseFloat((Math.random() * 300 + 20).toFixed(2)),
        status: statuses[Math.floor(Math.random() * statuses.length)],
    };
};

export const DashboardHome: React.FC = () => {
    const salesChartRef = useRef<HTMLCanvasElement>(null);
    const trafficChartRef = useRef<HTMLCanvasElement>(null);
    const salesChartInstance = useRef<any>(null);
    const trafficChartInstance = useRef<any>(null);

    // Data State
    const [totalRevenue, setTotalRevenue] = React.useState(405231.89);
    const [totalOrders, setTotalOrders] = React.useState(21452);
    const [newCustomers, setNewCustomers] = React.useState(1892);
    const [liveVisitors, setLiveVisitors] = React.useState(128);
    const [revenueData, setRevenueData] = React.useState([35000, 42000, 68000, 59000, 82000, 75000, 91000, 88000, 110000, 105000, 130000, 125000]);
    const [trafficData, setTrafficData] = React.useState([45, 25, 20, 10]);
    const [recentOrders, setRecentOrders] = React.useState<Order[]>(initialOrders);

    // AI Insights State
    const [aiInsights, setAiInsights] = React.useState("Click 'Refresh' to get AI-powered insights on your current dashboard data.");
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    // Function to fetch AI insights
    const generateInsights = async () => {
        setIsGenerating(true);
        setError(null);
        setAiInsights('');
        try {
            if (!process.env.API_KEY) {
                throw new Error("API key not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const currentData = {
                totalRevenue,
                totalOrders,
                newCustomers,
                liveVisitors,
                todayRevenue: revenueData[revenueData.length - 1],
                trafficSources: {
                    organic: trafficData[0],
                    social: trafficData[1],
                    direct: trafficData[2],
                    referral: trafficData[3],
                },
            };
            
            const prompt = `You are an expert e-commerce analyst for a platform called Evolv. Based on the following JSON data for an online store, provide a concise summary and 2-3 actionable recommendations. Use markdown for formatting (e.g., "**Summary**" for headings and "*" for bullet points). The data is: ${JSON.stringify(currentData)}. Keep your response professional, insightful, and brief.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setAiInsights(response.text);

        } catch (err) {
            console.error("Error fetching AI insights:", err);
            const errorMessage = (err instanceof Error && err.message.includes("API key"))
                ? "AI features are unavailable due to a configuration issue."
                : "Failed to generate insights. Please try again later.";
            setError(errorMessage);
            setAiInsights('');
        } finally {
            setIsGenerating(false);
        }
    };

    // Chart Initialization Effect
    useEffect(() => {
        const initCharts = () => {
            if (typeof Chart === 'undefined') return false;

            if (salesChartRef.current && !salesChartInstance.current) {
                const salesChartCtx = salesChartRef.current.getContext('2d');
                if (salesChartCtx) {
                    const salesGradient = salesChartCtx.createLinearGradient(0, 0, 0, 300);
                    salesGradient.addColorStop(0, 'rgba(167, 139, 250, 0.6)');
                    salesGradient.addColorStop(1, 'rgba(6, 182, 212, 0.1)');
                    salesChartInstance.current = new Chart(salesChartCtx, {
                        type: 'line',
                        data: {
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            datasets: [{ label: 'Revenue', data: revenueData, backgroundColor: salesGradient, borderColor: '#a78bfa', pointBackgroundColor: '#ffffff', pointBorderColor: '#a78bfa', pointHoverRadius: 7, pointHoverBackgroundColor: '#a78bfa', pointHoverBorderColor: '#ffffff', tension: 0.4, fill: 'start' }]
                        },
                        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2937', titleColor: '#e5e7eb', bodyColor: '#d1d5db', padding: 12, cornerRadius: 6, displayColors: false } }, scales: { y: { beginAtZero: false, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af', callback: (value: number) => '$' + value / 1000 + 'k' } }, x: { grid: { display: false }, ticks: { color: '#9ca3af' } } } }
                    });
                }
            }

            if (trafficChartRef.current && !trafficChartInstance.current) {
                const trafficChartCtx = trafficChartRef.current.getContext('2d');
                if (trafficChartCtx) {
                    trafficChartInstance.current = new Chart(trafficChartCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Organic Search', 'Social Media', 'Direct', 'Referral'],
                            datasets: [{ data: trafficData, backgroundColor: ['#a78bfa', '#06b6d4', '#6366f1', '#374151'], borderColor: '#111827', borderWidth: 3, hoverOffset: 10 }]
                        },
                        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#d1d5db', padding: 20, usePointStyle: true, pointStyle: 'circle' } }, tooltip: { backgroundColor: '#1f2937', titleColor: '#e5e7eb', bodyColor: '#d1d5db', padding: 12, cornerRadius: 6, displayColors: false, callbacks: { label: (context: any) => `${context.label || ''}: ${context.parsed || 0}%` } } } }
                    });
                }
            }
            return true;
        };

        if (!initCharts()) {
            const intervalId = setInterval(() => initCharts() && clearInterval(intervalId), 100);
            return () => clearInterval(intervalId);
        }
    }, []);

    // Data Simulation & Chart Update Effect
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate metrics
            setTotalRevenue(prev => prev + Math.random() * 500);
            setTotalOrders(prev => prev + Math.floor(Math.random() * 3));
            setNewCustomers(prev => (Math.random() > 0.5 ? prev + 1 : prev));
            setLiveVisitors(prev => Math.max(50, prev + Math.floor(Math.random() * 21) - 10));
            
            // Simulate chart data
            setRevenueData(prev => {
                const newData = [...prev];
                newData[newData.length - 1] = prev[prev.length - 1] + Math.random() * 2000;
                if (salesChartInstance.current) {
                    salesChartInstance.current.data.datasets[0].data = newData;
                    salesChartInstance.current.update('none');
                }
                return newData;
            });
            setTrafficData(prev => {
                const changes = [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1];
                const newRawData = prev.map((val, i) => Math.max(5, val + changes[i]));
                const total = newRawData.reduce((sum, val) => sum + val, 0);
                const newData = newRawData.map(val => Math.round((val / total) * 100));
                 if (trafficChartInstance.current) {
                    trafficChartInstance.current.data.datasets[0].data = newData;
                    trafficChartInstance.current.update('none');
                }
                return newData;
            });

            // Simulate recent orders
            if (Math.random() > 0.6) { // Add a new order sometimes
                setRecentOrders(prev => [generateNewOrder(), ...prev.slice(0, 3)]);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);
    
    // AI Insight renderer
    const renderInsights = () => {
        if (isGenerating) {
            return (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6 mt-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                </div>
            );
        }
        if (error) {
            return <p className="text-red-400">{error}</p>;
        }
    
        const lines = aiInsights.split('\n').filter(line => line.trim() !== '');
    
        return (
            <div className="text-gray-300 space-y-2">
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
                        return <p key={index} className="font-semibold text-white mt-3 first:mt-0">{trimmedLine.slice(2, -2)}</p>;
                    }
                    return <p key={index}>{line}</p>;
                })}
            </div>
        );
    };


    return (
        <>
            <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="dash-glass-card rounded-2xl p-6 fade-in-widget" style={{animationDelay: '0.1s'}}>
                    <p className="text-sm text-gray-400 mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold text-white mb-2">{formatCurrency(totalRevenue)}</p>
                    <span className="text-sm text-green-400">+12.5% from last month</span>
                </div>
                
                <div className="dash-glass-card rounded-2xl p-6 fade-in-widget" style={{animationDelay: '0.2s'}}>
                    <p className="text-sm text-gray-400 mb-2">Total Orders</p>
                    <p className="text-3xl font-bold text-white mb-2">{totalOrders.toLocaleString()}</p>
                    <span className="text-sm text-green-400">+8.1% from last month</span>
                </div>

                <div className="dash-glass-card rounded-2xl p-6 fade-in-widget" style={{animationDelay: '0.3s'}}>
                    <p className="text-sm text-gray-400 mb-2">New Customers</p>
                    <p className="text-3xl font-bold text-white mb-2">{newCustomers.toLocaleString()}</p>
                    <span className="text-sm text-red-400">-2.3% from last month</span>
                </div>

                <div className="lg:col-span-2 dash-glass-card rounded-2xl p-6 fade-in-widget" style={{animationDelay: '0.4s'}}>
                    <h3 className="text-lg font-semibold text-white mb-4">Revenue Overview</h3>
                    <div className="h-80">
                        <canvas ref={salesChartRef}></canvas>
                    </div>
                </div>

                <div className="dash-glass-card rounded-2xl p-6 fade-in-widget" style={{animationDelay: '0.5s'}}>
                    <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
                    <div className="h-80 flex items-center justify-center">
                        <canvas ref={trafficChartRef}></canvas>
                    </div>
                </div>
                
                 <div className="lg:col-span-2 dash-glass-card rounded-2xl p-6 fade-in-widget" style={{animationDelay: '0.6s'}}>
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700 text-sm text-gray-400">
                                    <th className="py-3 pr-3">Order ID</th>
                                    <th className="py-3 pr-3">Customer</th>
                                    <th className="py-3 pr-3">Total</th>
                                    <th className="py-3 pr-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id} className="border-b border-gray-800">
                                        <td className="py-4 pr-3 text-cyan-400 font-mono">{order.id}</td>
                                        <td className="py-4 pr-3">{order.customer}</td>
                                        <td className="py-4 pr-3">{formatCurrency(order.total)}</td>
                                        <td className="py-4 pr-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                order.status === 'Paid' ? 'bg-green-800 text-green-300' :
                                                order.status === 'Pending' ? 'bg-yellow-800 text-yellow-300' :
                                                'bg-red-800 text-red-300'
                                            }`}>{order.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="dash-glass-card rounded-2xl p-6 fade-in-widget" style={{animationDelay: '0.7s'}}>
                    <h3 className="text-lg font-semibold text-white mb-4">Live Visitors</h3>
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="relative globe mb-4">
                            <div className="pulse-point" style={{top: '30%', left: '60%', animationDelay: '0.2s'}}></div>
                            <div className="pulse-point" style={{top: '50%', left: '40%', animationDelay: '0.5s'}}></div>
                            <div className="pulse-point" style={{top: '65%', left: '70%', animationDelay: '1.1s'}}></div>
                            <div className="pulse-point" style={{top: '40%', left: '20%'}}></div>
                        </div>
                        <p className="text-3xl font-bold text-white">{liveVisitors}</p>
                        <p className="text-sm text-gray-400">Visitors online now</p>
                    </div>
                </div>

                 <div className="lg:col-span-3 dash-glass-card rounded-2xl p-6 fade-in-widget" style={{animationDelay: '0.8s'}}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-purple-400"><path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V11.25l2.28 2.28a.75.75 0 0 1-1.06 1.06L11.25 13.062V15a.75.75 0 0 1-1.5 0v-3.75l-2.28 2.28a.75.75 0 1 1-1.06-1.06L8.25 11.25V7.5a.75.75 0 0 1 1.5 0Zm-2.822 8.72a.75.75 0 0 1 1.06 0l1.72 1.72V20.25h1.5v-2.25l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z" /></svg>
                            Evolv AI Insights
                        </h3>
                        <button onClick={generateInsights} disabled={isGenerating} className="text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Refresh
                        </button>
                    </div>
                    {renderInsights()}
                </div>
            </div>
        </>
    );
};


const Dashboard: React.FC<{ route: string }> = ({ route }) => {
    const currentRoute = route || '#/dashboard';

    const renderContent = () => {
        if (currentRoute.startsWith('#/products')) {
            return <Products />;
        }
        if (currentRoute.startsWith('#/orders')) {
            return <Orders />;
        }
        if (currentRoute.startsWith('#/customers')) {
            return <Customers />;
        }
        if (currentRoute.startsWith('#/analytics')) {
            return <Analytics />;
        }
        if (currentRoute.startsWith('#/settings')) {
            return <Settings />;
        }
        return <DashboardHome />;
    };

    const getLinkClass = (path: string) => {
        const baseClass = "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors";

        const isDashboardHomeActive = path === '#/dashboard' && (currentRoute === '#/dashboard' || currentRoute === '' || currentRoute === '#/');
        const isOtherPageActive = path !== '#/dashboard' && currentRoute.startsWith(path);

        if (isDashboardHomeActive || isOtherPageActive) {
            return `${baseClass} bg-gray-800 text-white font-semibold`;
        }

        return `${baseClass} text-gray-400 hover:bg-gray-800 hover:text-white`;
    };

    return (
        <div className="bg-gray-950 text-gray-200 antialiased">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900 rounded-full filter blur-[150px] opacity-30 animate-breathe"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-900 rounded-full filter blur-[150px] opacity-30 animate-breathe animation-delay-[-4s]"></div>
            </div>

            <div className="flex h-screen">
                <aside className="w-64 dash-glass-card p-6 flex-col hidden md:flex z-20">
                    <a href="#/" className="text-3xl font-bold text-white mb-10">
                        Evolv<span className="text-cyan-400">.</span>
                    </a>
                    <nav className="flex-grow flex flex-col space-y-2">
                         <a href="#/dashboard" className={getLinkClass('#/dashboard')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                            <span>Dashboard</span>
                        </a>
                        <a href="#/orders" className={getLinkClass('#/orders')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                            <span>Orders</span>
                        </a>
                        <a href="#/products" className={getLinkClass('#/products')}>
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.703.542l.543-.203c.622-.23.967-.86.967-1.504v-.59a2.25 2.25 0 00-.659-1.591l-9.581-9.581A2.25 2.25 0 009.568 3zM11.25 9.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                           <span>Products</span>
                        </a>
                        <a href="#/customers" className={getLinkClass('#/customers')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.935c.415-.162.828-.351 1.23-.56M15 19.128A5.973 5.973 0 0011.188 10.5 5.973 5.973 0 007.5 4.872c-2.62 0-4.863 1.66-5.662 3.953a9.338 9.338 0 00-1.042 4.12c0 2.693 1.22 5.14 3.199 6.818" /></svg>
                            <span>Customers</span>
                        </a>
                        <a href="#/analytics" className={getLinkClass('#/analytics')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 019.75 19.875V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                            <span>Analytics</span>
                        </a>
                    </nav>

                    <div className="mt-auto">
                        <div className="border-t border-gray-800 pt-4">
                             <a href="#/settings" className={getLinkClass('#/settings')}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 010 1.255c-.008.378.138.75.43.99l1.004.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 010-1.255c.008-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>Settings</span>
                            </a>
                            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mt-2">
                                <img src="https://placehold.co/40x40/a78bfa/ffffff?text=A" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-700" />
                                <div>
                                    <span className="font-semibold text-white">Alex Morgan</span>
                                    <span className="block text-sm text-gray-400">alex@evolv.com</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </aside>

                <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                     <header className="sticky top-0 z-30 dash-glass-card">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="relative w-full max-w-md">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                </span>
                                <input type="text" placeholder="Search (Cmd+K)" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <a href="#/products" className="hidden sm:inline-block bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all shadow-lg text-sm">
                                    + Add Product
                                </a>
                                <button className="text-gray-400 hover:text-white relative">
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                                </button>
                                <img src="https://placehold.co/40x40/a78bfa/ffffff?text=A" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-700 md:hidden" />
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 p-6 md:p-8">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
