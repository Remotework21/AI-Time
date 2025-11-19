// src/services/newsApi.js
const API_BASE = 'http://localhost:5000'; // ✅ Update later to your deployed URL

// Fetch paginated news (offset = how many to skip)
export const fetchNews = async ({ limit = 10, offset = 0, category = 'all', search = '' }) => {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit);
    params.append('offset', offset); // ⚠️ Backend doesn’t support offset yet — we’ll simulate on frontend
    let url = `${API_BASE}/api/news?${params.toString()}`;

    if (category && category !== 'all') {
      // Map UI tab names → backend categories
      const categoryMap = {
        tech: 'تقنية',
        tips: 'نصائح',
        market: 'أعمال', // closest match
        research: 'أبحاث',
        events: 'فعاليات',
        education: 'تعليم',
        health: 'صحة'
      };
      const backendCat = categoryMap[category] || category;
      url = `${API_BASE}/api/news/category/${encodeURIComponent(backendCat)}?limit=${limit}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!data.success) throw new Error(data.error || 'فشل جلب الأخبار');

    // Simulate offset on frontend if backend doesn’t support it yet
    let news = data.news || [];
    if (offset > 0 && category === 'all') {
      // For "all" only — fetch full list once, paginate client-side (simpler for now)
      // We'll improve later with real backend pagination
    }

    // Apply search filter on client (title + summary)
    if (search) {
      const term = search.toLowerCase().trim();
      news = news.filter(item =>
        (item.title && item.title.toLowerCase().includes(term)) ||
        (item.summary && item.summary.toLowerCase().includes(term))
      );
    }

    return news;
  } catch (err) {
    console.error('❌ fetchNews error:', err);
    throw err;
  }
};