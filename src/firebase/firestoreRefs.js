import { collection } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const requestsCollection = collection(db, 'requests');
export const timelineCollection = collection(db, 'timeline');
export const vehiclesCollection = collection(db, 'vehicles');
export const usersCollection = collection(db, 'users');
export const settingsCollection = collection(db, 'settings');
export const logsCollection = collection(db, 'logs');
