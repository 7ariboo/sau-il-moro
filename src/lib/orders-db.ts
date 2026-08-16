import { adminDb } from './firebase-admin';
import { Order } from './types';

const ORDERS_COLLECTION = 'orders';

/**
 * Save an order to Firestore (uses order.id as document ID).
 */
export async function saveOrder(order: Order): Promise<void> {
  await adminDb.collection(ORDERS_COLLECTION).doc(order.id).set(order);
}

/**
 * Fetch all orders from Firestore, sorted by createdAt descending.
 */
export async function getAllOrders(): Promise<Order[]> {
  const snapshot = await adminDb
    .collection(ORDERS_COLLECTION)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => doc.data() as Order);
}

/**
 * Fetch a single order by ID.
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const doc = await adminDb.collection(ORDERS_COLLECTION).doc(id).get();
  return doc.exists ? (doc.data() as Order) : null;
}

/**
 * Update an order's status in Firestore.
 */
export async function updateOrderStatus(id: string, status: string): Promise<Order | null> {
  const docRef = adminDb.collection(ORDERS_COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  await docRef.update({ status });
  const updated = await docRef.get();
  return updated.data() as Order;
}

/**
 * Generate a unique order ID in SM-XXXXXX format.
 */
export function generateOrderId(): string {
  return `SM-${Math.floor(100000 + Math.random() * 900000)}`;
}
