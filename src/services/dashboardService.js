import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const requestsRef = collection(db, 'requests');

export const getDashboardSummary = async () => {
  const snapshot = await getDocs(query(requestsRef, orderBy('createdAt', 'desc')));
  const items = snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
  const statusGroups = items.reduce(
    (acc, item) => ({
      ...acc,
      [item.status]: (acc[item.status] || 0) + 1,
    }),
    {}
  );

  return {
    totalRequests: items.length,
    completed: statusGroups['เสร็จสิ้น'] || 0,
    pending: items.length - (statusGroups['เสร็จสิ้น'] || 0) - (statusGroups['ยกเลิก'] || 0),
    cancelled: statusGroups['ยกเลิก'] || 0,
    byMonth: items.reduce((acc, item) => {
      const month = item.createdAt?.toDate ? item.createdAt.toDate().getMonth() + 1 : new Date(item.createdAt).getMonth() + 1;
      const monthKey = `${month}`.padStart(2, '0');
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    }, {}),
  };
};
