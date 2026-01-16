/**
 * Collection Analytics Tracking Utilities
 * Helper functions to track collection events from the storefront
 */

// Generate a unique session ID for anonymous users
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Track collection view event
export const trackCollectionView = async (
  storeId: string,
  collectionId: string,
  sectionId?: string,
  customerId?: string
) => {
  try {
    await fetch('/api/track-collection-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId,
        collectionId,
        sectionId,
        eventType: 'view',
        customerId,
        sessionId: getSessionId()
      })
    });
  } catch (error) {
    console.error('Failed to track collection view:', error);
  }
};

// Track collection product click
export const trackCollectionClick = async (
  storeId: string,
  collectionId: string,
  productId: string,
  sectionId?: string,
  customerId?: string
) => {
  try {
    await fetch('/api/track-collection-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId,
        collectionId,
        sectionId,
        productId,
        eventType: 'click',
        customerId,
        sessionId: getSessionId()
      })
    });
  } catch (error) {
    console.error('Failed to track collection click:', error);
  }
};

// Track add to cart from collection
export const trackCollectionAddToCart = async (
  storeId: string,
  collectionId: string,
  productId: string,
  sectionId?: string,
  customerId?: string
) => {
  try {
    await fetch('/api/track-collection-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId,
        collectionId,
        sectionId,
        productId,
        eventType: 'add_to_cart',
        customerId,
        sessionId: getSessionId()
      })
    });
  } catch (error) {
    console.error('Failed to track add to cart:', error);
  }
};

// Track purchase from collection
export const trackCollectionPurchase = async (
  storeId: string,
  collectionId: string,
  productId: string,
  revenue: number,
  sectionId?: string,
  customerId?: string
) => {
  try {
    await fetch('/api/track-collection-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId,
        collectionId,
        sectionId,
        productId,
        eventType: 'purchase',
        revenue,
        customerId,
        sessionId: getSessionId()
      })
    });
  } catch (error) {
    console.error('Failed to track purchase:', error);
  }
};

// Batch track multiple collection views (for optimization)
export const trackCollectionViewBatch = async (
  storeId: string,
  collectionIds: string[],
  customerId?: string
) => {
  const sessionId = getSessionId();
  const promises = collectionIds.map(collectionId =>
    fetch('/api/track-collection-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId,
        collectionId,
        eventType: 'view',
        customerId,
        sessionId
      })
    }).catch(err => console.error('Batch tracking error:', err))
  );
  
  await Promise.all(promises);
};

// Get collection analytics (for admin dashboard)
export const getCollectionAnalytics = async (
  type: 'summary' | 'trending' | 'top-products' | 'funnel' | 'stats',
  params: {
    storeId?: string;
    collectionId?: string;
    period?: 'today' | 'week' | 'month' | 'all_time';
    limit?: number;
  }
) => {
  try {
    const queryParams = new URLSearchParams({
      type,
      ...params
    } as any);

    const response = await fetch(`/api/collection-analytics?${queryParams}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch analytics');
    }

    return data.data;
  } catch (error) {
    console.error('Failed to fetch collection analytics:', error);
    throw error;
  }
};

// Helper to format conversion rate
export const formatConversionRate = (rate: number): string => {
  return `${rate.toFixed(2)}%`;
};

// Helper to format revenue
export const formatRevenue = (revenue: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(revenue);
};

// Helper to calculate growth percentage
export const calculateGrowth = (current: number, previous: number): string => {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const growth = ((current - previous) / previous) * 100;
  return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
};
