import { getDocs, query, collection, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const reportsRef = collection(db, 'reports');

export const getMonthlyReport = async (year) => {
  const q = query(reportsRef, where('year', '==', year), orderBy('month', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
};

export const getAnnualSummary = async () => {
  const q = query(reportsRef, orderBy('year', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
};
