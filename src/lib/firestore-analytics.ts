import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  setDoc,
  increment,
  getDoc,
} from 'firebase/firestore';

// ===== PAGE VIEWS =====

export async function recordPageView(path: string) {
  if (!db) return;
  try {
    // 1. Add individual page view record
    await addDoc(collection(db, 'pageViews'), {
      path,
      timestamp: Timestamp.now(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    });

    // 2. Increment daily counter
    const today = new Date().toISOString().split('T')[0];
    const dailyRef = doc(db, 'dailyStats', today);
    await setDoc(dailyRef, {
      views: increment(1),
      date: today,
    }, { merge: true });

    // 3. Increment page-specific counter for today
    const pageRef = doc(db, 'dailyStats', today, 'pages', encodeURIComponent(path));
    await setDoc(pageRef, {
      path,
      views: increment(1),
    }, { merge: true });
  } catch (e) {
    console.error('Firestore pageView error:', e);
  }
}

// ===== DAILY STATS =====

export async function getDailyStats(days: number = 7): Promise<{ date: string; views: number }[]> {
  if (!db) return [];
  try {
    const results: { date: string; views: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const ref = doc(db, 'dailyStats', dateStr);
      const snap = await getDoc(ref);
      results.push({
        date: d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' }),
        views: snap.exists() ? (snap.data().views || 0) : 0,
      });
    }
    return results;
  } catch (e) {
    console.error('Firestore getDailyStats error:', e);
    return [];
  }
}

export async function getTodayStats(): Promise<{ views: number; topPages: { path: string; views: number }[] }> {
  if (!db) return { views: 0, topPages: [] };
  try {
    const today = new Date().toISOString().split('T')[0];
    const ref = doc(db, 'dailyStats', today);
    const snap = await getDoc(ref);
    const views = snap.exists() ? (snap.data().views || 0) : 0;

    // Get top pages for today
    const pagesSnap = await getDocs(collection(db, 'dailyStats', today, 'pages'));
    const topPages = pagesSnap.docs
      .map(d => ({ path: decodeURIComponent(d.id), views: d.data().views || 0 }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    return { views, topPages };
  } catch (e) {
    console.error('Firestore getTodayStats error:', e);
    return { views: 0, topPages: [] };
  }
}

// ===== ACTIVE VISITORS (5-min window via Firestore) =====

export async function pingActiveVisitor(visitorId: string) {
  if (!db) return;
  try {
    const ref = doc(db, 'activeVisitors', visitorId);
    await setDoc(ref, {
      lastSeen: Timestamp.now(),
    });
  } catch (e) {
    console.error('Firestore pingActiveVisitor error:', e);
  }
}

export async function getActiveVisitorCount(): Promise<number> {
  if (!db) return 0;
  try {
    const fiveMinAgo = Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000));
    const q = query(
      collection(db, 'activeVisitors'),
      where('lastSeen', '>=', fiveMinAgo)
    );
    const snap = await getDocs(q);
    return snap.size;
  } catch (e) {
    console.error('Firestore getActiveVisitorCount error:', e);
    return 0;
  }
}
