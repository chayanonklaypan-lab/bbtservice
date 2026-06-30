import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import requestStatus from '../constants/status';

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
    completed: statusGroups[requestStatus.COMPLETED] || 0,
    pending:
      items.length -
      (statusGroups[requestStatus.COMPLETED] || 0) -
      (statusGroups[requestStatus.CANCELLED] || 0),
    cancelled: statusGroups[requestStatus.CANCELLED] || 0,
    byMonth: items.reduce((acc, item) => {
      const date = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
      if (Number.isNaN(date.getTime())) {
        return acc;
      }
      const month = date.getMonth() + 1;
      const monthKey = `${month}`.padStart(2, '0');
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    }, {}),
  };
};
