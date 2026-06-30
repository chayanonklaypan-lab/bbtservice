import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const requestsRef = collection(db, 'requests');

export const getCalendarEvents = async (filters = {}) => {
  let q = query(requestsRef, orderBy('scheduledAt', 'asc'));

  if (filters.startDate && filters.endDate) {
    q = query(q, where('scheduledAt', '>=', filters.startDate));
    q = query(q, where('scheduledAt', '<=', filters.endDate));
  }

  if (filters.requestType) {
    q = query(q, where('requestType', '==', filters.requestType));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
};
