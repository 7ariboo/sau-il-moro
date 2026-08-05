import { NextResponse } from 'next/server';

// In-memory analytics store (persists per server instance)
interface PageView {
  path: string;
  timestamp: number;
  userAgent?: string;
  referrer?: string;
}

const pageViews: PageView[] = [];
const ACTIVE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes = "active" visitor
const MAX_STORED_VIEWS = 10000; // Cap to prevent memory issues

// POST — Record a page view
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, referrer } = body;
    const userAgent = request.headers.get('user-agent') || '';

    pageViews.push({
      path: path || '/',
      timestamp: Date.now(),
      userAgent,
      referrer: referrer || '',
    });

    // Trim old entries beyond cap
    if (pageViews.length > MAX_STORED_VIEWS) {
      pageViews.splice(0, pageViews.length - MAX_STORED_VIEWS);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// GET — Return analytics summary
export async function GET() {
  const now = Date.now();

  // Active visitors (unique user-agents in last 5 minutes)
  const activeThreshold = now - ACTIVE_WINDOW_MS;
  const recentViews = pageViews.filter(v => v.timestamp >= activeThreshold);
  const activeVisitors = new Set(recentViews.map(v => v.userAgent)).size;

  // Today's stats
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayViews = pageViews.filter(v => v.timestamp >= todayStart.getTime());
  const todayUniqueVisitors = new Set(todayViews.map(v => v.userAgent)).size;

  // Last 7 days breakdown
  const last7Days: { date: string; views: number; visitors: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date();
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const dayViews = pageViews.filter(v => v.timestamp >= dayStart.getTime() && v.timestamp <= dayEnd.getTime());
    const dayVisitors = new Set(dayViews.map(v => v.userAgent)).size;

    last7Days.push({
      date: dayStart.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' }),
      views: dayViews.length,
      visitors: dayVisitors,
    });
  }

  // Top pages today
  const pageCounts: Record<string, number> = {};
  todayViews.forEach(v => {
    pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  return NextResponse.json({
    success: true,
    data: {
      activeVisitors,
      todayViews: todayViews.length,
      todayUniqueVisitors,
      totalViews: pageViews.length,
      last7Days,
      topPages,
    },
  });
}
