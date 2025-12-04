import React, { useState, useMemo } from 'react';

type LoyaltyStatus = 'Gold' | 'Silver' | 'Bronze' | 'New';
type SortKey = 'name' | 'joinDate' | 'orderCount' | 'totalSpent';
type SortDirection = 'asc' | 'desc';

interface Customer {
    id: number;
    name: string;
    email: string;
    avatar: string;
    joinDate: string;
    orderCount: number;
    totalSpent: number;
    loyaltyStatus: LoyaltyStatus;
}

// Generate more comprehensive mock customer data
const mockCustomers: Customer[] = Array.from({ length: 64 }, (_, i) => {
    const names = ['Sophia Davis', 'Jackson Martinez', 'Isabella Rodriguez', 'Aiden Taylor', 'Mia Anderson', 'Lucas Thomas', 'Harper Jackson', 'Ethan White', 'Amelia Harris', 'James Martin', 'Evelyn Thompson', 'Benjamin Garcia'];
    const name = names[i % names.length];
    const totalSpent = parseFloat((Math.random() * 5000 + 50).toFixed(2));
    let loyaltyStatus: LoyaltyStatus = 'New';
    if (totalSpent > 2500) loyaltyStatus = 'Gold';
    else if (totalSpent > 1000) loyaltyStatus = 'Silver';
    else if (totalSpent > 200) loyaltyStatus = 'Bronze';
    
    return {
        id: 1001 + i,
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        avatar: `https://i.pravatar.cc/40?u=${1001 + i}`,
        joinDate: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 5).toISOString().split('T')[0],
        orderCount: Math.floor(totalSpent / (Math.random() * 150 + 50)),
        totalSpent,
        loyaltyStatus,
    };
});

const ITEMS_PER_PAGE = 10;

const Customers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'totalSpent', direction: 'desc' });
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    const sortedAndFilteredCustomers = useMemo(() => {
        let filtered = mockCustomers.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                let aValue, bValue;
                if (sortConfig.key === 'name') {
                    aValue = a.name;
                    bValue = b.name;
                } else if (sortConfig.key === 'joinDate') {
                    aValue = new Date(a.joinDate).getTime();
                    bValue = new Date(b.joinDate).getTime();
                } else {
                    aValue = a[sortConfig.key];
                    bValue = b[sortConfig.key];
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [searchTerm, sortConfig]);

    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedAndFilteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedAndFilteredCustomers, currentPage]);

    const totalPages = Math.ceil(sortedAndFilteredCustomers.length / ITEMS_PER_PAGE);

    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const SortableHeader: React.FC<{ sortKey: SortKey, title: string, className?: string }> = ({ sortKey, title, className }) => {
        const isSorting = sortConfig?.key === sortKey;
        const icon = isSorting ? (sortConfig?.direction === 'asc' ? '▲' : '▼') : '';
        return (
            <th className={`py-3 px-4 cursor-pointer ${className}`} onClick={() => requestSort(sortKey)}>
                <div className="flex items-center space-x-1">
                    <span>{title}</span>
                    <span className="text-xs text-cyan-400">{icon}</span>
                </div>
            </th>
        );
    };

    const LoyaltyBadge: React.FC<{ status: LoyaltyStatus }> = ({ status }) => {
        const statusClasses = {
            Gold: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
            Silver: "bg-gray-400/20 text-gray-300 border-gray-400/30",
            Bronze: "bg-orange-400/20 text-orange-300 border-orange-400/30",
            New: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
        };
        return <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${statusClasses[status]}`}>{status}</span>;
    };

    return (
        <div className="fade-in-widget">
            <h1 className="text-3xl font-bold text-white mb-6">Customers</h1>
            
            <div className="dash-glass-card rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                    <div className="relative w-full md:max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Search by name or email" 
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700 text-sm text-gray-400">
                                <SortableHeader sortKey="name" title="Customer" />
                                <SortableHeader sortKey="joinDate" title="Join Date" />
                                <th className="py-3 px-4">Loyalty Status</th>
                                <SortableHeader sortKey="orderCount" title="Orders" className="text-center" />
                                <SortableHeader sortKey="totalSpent" title="Total Spent" />
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCustomers.map(customer => (
                                <tr key={customer.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full"/>
                                            <div>
                                                <div className="font-medium text-white">{customer.name}</div>
                                                <div className="text-sm text-gray-400">{customer.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-300">{customer.joinDate}</td>
                                    <td className="py-3 px-4"><LoyaltyBadge status={customer.loyaltyStatus} /></td>
                                    <td className="py-3 px-4 text-center text-gray-300">{customer.orderCount}</td>
                                    <td className="py-3 px-4 font-medium text-white">{formatCurrency(customer.totalSpent)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {paginatedCustomers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No customers found.</p>
                    </div>
                )}
                
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-800">
                    <span className="text-sm text-gray-400">
                        Showing <span className="font-medium text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * ITEMS_PER_PAGE, sortedAndFilteredCustomers.length)}</span> of <span className="font-medium text-white">{sortedAndFilteredCustomers.length}</span> results
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

export default Customers;