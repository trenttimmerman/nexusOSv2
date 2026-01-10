import React, { useEffect, useState } from 'react';
import { getSubscribers, unsubscribeEmail, type EmailSubscriber } from '../lib/emailService';

interface EmailSubscribersProps {
  siteId: string;
}

export default function EmailSubscribers({ siteId }: EmailSubscribersProps) {
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed' | 'pending'>('all');
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  const pageSize = 50;

  useEffect(() => {
    loadSubscribers();
  }, [siteId, search, statusFilter, page]);

  async function loadSubscribers() {
    setLoading(true);
    const options: any = {
      limit: pageSize,
      offset: page * pageSize,
    };

    if (search) {
      options.search = search;
    }

    if (statusFilter !== 'all') {
      options.status = statusFilter;
    }

    const result = await getSubscribers(siteId, options);
    setSubscribers(result.subscribers);
    setTotal(result.total);
    setLoading(false);
  }

  async function handleUnsubscribe(email: string) {
    if (!confirm(`Unsubscribe ${email}?`)) return;

    const result = await unsubscribeEmail(siteId, email);
    if (result.success) {
      alert(result.message);
      loadSubscribers();
    } else {
      alert('Error: ' + result.message);
    }
  }

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedRows(new Set(subscribers.map((s) => s.id)));
    } else {
      setSelectedRows(new Set());
    }
  }

  function handleSelectRow(id: string, checked: boolean) {
    const newSet = new Set(selectedRows);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedRows(newSet);
  }

  function exportToCSV() {
    const selectedSubscribers = subscribers.filter((s) => selectedRows.has(s.id));
    const dataToExport = selectedSubscribers.length > 0 ? selectedSubscribers : subscribers;

    const headers = [
      'Email',
      'Subscribed At',
      'Status',
      'Source Page',
      'Form Variant',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Confirmed',
      'Terms Accepted',
    ];

    const rows = dataToExport.map((sub) => [
      sub.email,
      new Date(sub.subscribed_at).toLocaleString(),
      sub.unsubscribed_at ? 'Unsubscribed' : sub.double_opt_in_confirmed ? 'Active' : 'Pending',
      sub.source_page || '',
      sub.form_variant || '',
      sub.utm_source || '',
      sub.utm_medium || '',
      sub.utm_campaign || '',
      sub.double_opt_in_confirmed ? 'Yes' : 'No',
      sub.accepted_terms ? 'Yes' : 'No',
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Subscribers</h2>
        <p className="text-gray-600">
          Total: {total} subscribers
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as any);
            setPage(0);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending Confirmation</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>

        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Export CSV {selectedRows.size > 0 && `(${selectedRows.size})`}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading subscribers...</div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No subscribers found{search ? ' matching your search' : ''}.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === subscribers.length && subscribers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subscribed</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Source</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">UTM</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(sub.id)}
                        onChange={(e) => handleSelectRow(sub.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {sub.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {sub.unsubscribed_at ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Unsubscribed
                        </span>
                      ) : sub.double_opt_in_confirmed ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(sub.subscribed_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="max-w-[150px] truncate" title={sub.source_page || 'Direct'}>
                        {sub.source_page || 'Direct'}
                      </div>
                      {sub.form_variant && (
                        <div className="text-xs text-gray-400">{sub.form_variant}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {sub.utm_source || sub.utm_medium || sub.utm_campaign ? (
                        <div className="text-xs">
                          {sub.utm_source && <div>Source: {sub.utm_source}</div>}
                          {sub.utm_medium && <div>Medium: {sub.utm_medium}</div>}
                          {sub.utm_campaign && <div>Campaign: {sub.utm_campaign}</div>}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {!sub.unsubscribed_at && (
                        <button
                          onClick={() => handleUnsubscribe(sub.email)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Unsubscribe
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, total)} of {total}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 3) {
                      pageNum = i;
                    } else if (page > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
