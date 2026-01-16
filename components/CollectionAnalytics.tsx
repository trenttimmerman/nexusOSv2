import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, MousePointer, ShoppingCart, DollarSign, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { getCollectionAnalytics, formatRevenue, formatConversionRate, calculateGrowth } from '../lib/collectionAnalytics';

interface CollectionAnalyticsProps {
  storeId: string;
}

export const CollectionAnalytics: React.FC<CollectionAnalyticsProps> = ({ storeId }) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all_time'>('week');
  const [summary, setSummary] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [funnel, setFunnel] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [storeId, period]);

  useEffect(() => {
    if (selectedCollection) {
      loadCollectionDetails(selectedCollection);
    }
  }, [selectedCollection, period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryData, trendingData] = await Promise.all([
        getCollectionAnalytics('summary', { storeId, period }),
        getCollectionAnalytics('trending', { storeId })
      ]);
      setSummary(summaryData || []);
      setTrending(trendingData || []);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCollectionDetails = async (collectionId: string) => {
    try {
      const [funnelData, productsData] = await Promise.all([
        getCollectionAnalytics('funnel', { collectionId, period }),
        getCollectionAnalytics('top-products', { collectionId, period, limit: 10 })
      ]);
      setFunnel(funnelData);
      setTopProducts(productsData || []);
    } catch (error) {
      console.error('Failed to load collection details:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Collection Analytics</h2>
        
        {/* Period Selector */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="all_time">All Time</option>
        </select>
      </div>

      {/* Trending Collections */}
      {trending.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Trending This Week</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trending.slice(0, 3).map((collection) => (
              <div 
                key={collection.id}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCollection(collection.id)}
              >
                <h4 className="font-medium text-gray-900 mb-2">{collection.name}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Activity</span>
                    <span className="font-semibold text-indigo-600">{collection.recent_activity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Purchases</span>
                    <span className="font-semibold text-green-600">{collection.recent_purchases}</span>
                  </div>
                  {collection.growth_rate && (
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <ArrowUp className="w-3 h-3" />
                      {(collection.growth_rate * 100).toFixed(0)}% growth
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collection Performance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Collection Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Collection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conv. Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summary.map((item) => (
                <tr 
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCollection(item.collection_id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.collections?.name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.collections?.type || 'manual'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Eye className="w-4 h-4 text-gray-400" />
                      {item.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <MousePointer className="w-4 h-4 text-gray-400" />
                      {item.clicks}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <ShoppingCart className="w-4 h-4 text-gray-400" />
                      {item.add_to_carts}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {item.purchases}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      {formatRevenue(parseFloat(item.revenue || 0))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-indigo-600">
                      {formatConversionRate(parseFloat(item.conversion_rate || 0))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collection Details Modal/Panel */}
      {selectedCollection && funnel && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Collection Details</h3>
            <button
              onClick={() => setSelectedCollection(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          {/* Conversion Funnel */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Conversion Funnel</h4>
            <div className="space-y-2">
              <FunnelStep label="Views" value={funnel.views} percentage={100} />
              <FunnelStep label="Clicks" value={funnel.clicks} percentage={funnel.clickRate} />
              <FunnelStep label="Add to Cart" value={funnel.addToCarts} percentage={funnel.cartRate} />
              <FunnelStep label="Purchases" value={funnel.purchases} percentage={funnel.purchaseRate} />
            </div>
          </div>

          {/* Top Products */}
          {topProducts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Top Performing Products</h4>
              <div className="space-y-2">
                {topProducts.map((product, index) => (
                  <div key={product.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-500">#{index + 1}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                        <div className="text-xs text-gray-500">
                          {product.purchases} sales • {formatRevenue(parseFloat(product.revenue))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-indigo-600">
                      {formatConversionRate(parseFloat(product.conversion_rate))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {summary.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data Yet</h3>
          <p className="text-gray-500">
            Collection analytics will appear here once customers start interacting with your collections.
          </p>
        </div>
      )}
    </div>
  );
};

// Funnel Step Component
const FunnelStep: React.FC<{ label: string; value: number; percentage: number | string }> = ({ 
  label, 
  value, 
  percentage 
}) => {
  const pct = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-900">
          {value} ({typeof percentage === 'string' ? percentage : `${percentage.toFixed(1)}%`})
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all" 
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
};
