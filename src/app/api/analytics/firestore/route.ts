import { NextResponse } from 'next/server';
import { getDailyStats, getTodayStats, getActiveVisitorCount } from '@/lib/firestore-analytics';

// GET — Return persistent Firestore analytics
export async function GET() {
  try {
    const [activeVisitors, todayStats, last7Days] = await Promise.all([
      getActiveVisitorCount(),
      getTodayStats(),
      getDailyStats(7),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        activeVisitors,
        todayViews: todayStats.views,
        todayUniqueVisitors: todayStats.views, // approximation from Firestore counters
        topPages: todayStats.topPages,
        last7Days: last7Days.map(d => ({
          ...d,
          visitors: d.views, // simplified: views ≈ visitors at this level
        })),
      },
    });
  } catch (error) {
    console.error('Firestore analytics error:', error);
    return NextResponse.json({ success: false, error: 'Analytics error' }, { status: 500 });
  }
}
