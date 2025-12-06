import React, { useState, useMemo } from 'react';

type OrderStatus = 'Shipped' | 'Processing' | 'Pending' | 'Canceled';
type FilterStatus = OrderStatus | 'All';

interface Order {
    id: string;
    customer: string;
    email: string;
    date: string;
    items: number;
    total: number;
    status: OrderStatus;
}

// Generate more comprehensive mock data
const mockOrders: Order[] = Array.from({ length: 58 }, (_, i) => {
    const statuses: OrderStatus[] = ['Shipped', 'Processing', 'Pending', 'Canceled'];
    const names = ['Liam Smith', 'Olivia Johnson', 'Noah Williams', 'Emma Brown', 'Oliver Jones', 'Ava Garcia', 'Elijah Miller', 'Charlotte Davis', 'William Rodriguez', 'Sophia Martinez'];
    const name = names[i % names.length];
    return {
        id: `#${(18423 + i * 37).toString()}`,
        customer: name,
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        date: new Date(Date.now() - i * 1000 * 60 * 60 * 18).toISOString().split('T')[0],
        items: Math.floor(Math.random() * 5) + 1,
        total: parseFloat((Math.random() * 400 + 20).toFixed(2)),
        status: statuses[i % statuses.length],
    };
});

const ITEMS_PER_PAGE = 10;

const Orders: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');
    const [currentPage, setCurrentPage] = useState(1);

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    const filteredOrders = useMemo(() => {
        return mockOrders
            .filter(order => activeFilter === 'All' || order.status === activeFilter)
            .filter(order => 
                order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [searchTerm, activeFilter]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredOrders, currentPage]);
    
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    
    const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
        const baseClasses = "px-2.5 py-1 rounded-full text-xs font-medium";
        const statusClasses = {
            Shipped: "bg-green-800 text-green-300",
            Processing: "bg-blue-800 text-blue-300",
            Pending: "bg-yellow-800 text-yellow-300",
            Canceled: "bg-red-800 text-red-300",
        };
        return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
    };

    const FilterTab: React.FC<{ status: FilterStatus, count: number }> = ({ status, count }) => {
        const isActive = activeFilter === status;
        return (
            <button
                onClick={() => { setActiveFilter(status); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
            >
                {status} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-cyan-500 text-gray-950' : 'bg-gray-700 text-gray-300'}`}>{count}</span>
            </button>
        );
    };

    return (
        <div className="fade-in-widget">
            <h1 className="text-3xl font-bold text-white mb-6">Orders</h1>
            
            <div className="dash-glass-card rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                    <div className="relative w-full md:max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Search by name, email, or ID" 
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2 p-1 bg-gray-900/50 rounded-lg">
                        <FilterTab status="All" count={mockOrders.length} />
                        <FilterTab status="Shipped" count={mockOrders.filter(o => o.status === 'Shipped').length} />
                        <FilterTab status="Processing" count={mockOrders.filter(o => o.status === 'Processing').length} />
                        <FilterTab status="Pending" count={mockOrders.filter(o => o.status === 'Pending').length} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700 text-sm text-gray-400">
                                <th className="py-3 px-4">Order ID</th>
                                <th className="py-3 px-4">Customer</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4 text-center">Items</th>
                                <th className="py-3 px-4">Total</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.map(order => (
                                <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                    <td className="py-4 px-4 text-cyan-400 font-mono">{order.id}</td>
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-white">{order.customer}</div>
                                        <div className="text-sm text-gray-400">{order.email}</div>
                                    </td>
                                    <td className="py-4 px-4">{order.date}</td>
                                    <td className="py-4 px-4 text-center">{order.items}</td>
                                    <td className="py-4 px-4">{formatCurrency(order.total)}</td>
                                    <td className="py-4 px-4"><StatusBadge status={order.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {paginatedOrders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No orders found.</p>
                    </div>
                )}
                
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-800">
                    <span className="text-sm text-gray-400">
                        Showing <span className="font-medium text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)}</span> of <span className="font-medium text-white">{filteredOrders.length}</span> results
                    </span>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 bg-gray-800 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                        >
                            Previous
                        </button>
                        <button 
                             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                             disabled={currentPage === totalPages}
                             className="px-3 py-1.5 bg-gray-800 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
