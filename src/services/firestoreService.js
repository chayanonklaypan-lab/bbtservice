import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import requestStatus from '../constants/status';
import vehicleStatus from '../constants/vehicleStatus';

const requestsRef = collection(db, 'requests');
const timelineRef = collection(db, 'timeline');
const vehiclesRef = collection(db, 'vehicles');
const usersRef = collection(db, 'users');
const settingsRef = collection(db, 'settings');
const logsRef = collection(db, 'logs');

export const getRequests = async (filters = {}) => {
  let q = query(requestsRef, orderBy('createdAt', 'desc'));

  if (filters.status) {
    q = query(q, where('status', '==', filters.status));
  }

  if (filters.requestType) {
    q = query(q, where('requestType', '==', filters.requestType));
  }

  if (filters.vehicleId) {
    q = query(q, where('vehicleId', '==', filters.vehicleId));
  }

  if (filters.assigneeId) {
    q = query(q, where('assigneeId', '==', filters.assigneeId));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
};

export const getRequestById = async (id) => {
  const requestDoc = doc(requestsRef, id);
  const snapshot = await getDoc(requestDoc);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const createRequest = async (payload) => {
  const now = Timestamp.now();
  const requestId = `REQ-${now.toDate().getFullYear()}${String(now.toDate().getMonth() + 1).padStart(2, '0')}-${String(now.seconds).padStart(6, '0')}`;
  const request = {
    ...payload,
    requestId,
    receivedDate: now.toDate().toISOString(),
    status: requestStatus.NEW,
    createdAt: now,
    updatedAt: now,
  };
  const docRef = await addDoc(requestsRef, request);
  return docRef.id;
};

export const updateRequest = async (id, payload) => {
  const requestDoc = doc(requestsRef, id);
  await updateDoc(requestDoc, {
    ...payload,
    updatedAt: Timestamp.now(),
  });
};

export const deleteRequest = async (id) => {
  await deleteDoc(doc(requestsRef, id));
};

export const addTimelineEntry = async (requestId, entry) => {
  const timelineDoc = doc(timelineRef);
  await setDoc(timelineDoc, {
    requestId,
    ...entry,
    createdAt: Timestamp.now(),
  });
};

export const getTimelineByRequestId = async (requestId) => {
  const q = query(timelineRef, where('requestId', '==', requestId), orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
};

export const getVehicles = async () => {
  const snapshot = await getDocs(query(vehiclesRef, orderBy('name')));
  return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
};

export const createVehicle = async (payload) => {
  const vehicle = {
    ...payload,
    status: payload.status || vehicleStatus.AVAILABLE,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(vehiclesRef, vehicle);
  return docRef.id;
};

export const updateVehicle = async (id, payload) => {
  const vehicleDoc = doc(vehiclesRef, id);
  await updateDoc(vehicleDoc, {
    ...payload,
    updatedAt: Timestamp.now(),
  });
};

export const deleteVehicle = async (id) => {
  await deleteDoc(doc(vehiclesRef, id));
};

export const getUsers = async () => {
  const snapshot = await getDocs(query(usersRef, orderBy('displayName')));
  return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
};

export const createUser = async (payload) => {
  const userDoc = doc(usersRef, payload.uid || payload.email);
  await setDoc(userDoc, {
    ...payload,
    updatedAt: Timestamp.now(),
  });
};

export const updateUser = async (id, payload) => {
  const userDoc = doc(usersRef, id);
  await updateDoc(userDoc, {
    ...payload,
    updatedAt: Timestamp.now(),
  });
};

export const deleteUser = async (id) => {
  await deleteDoc(doc(usersRef, id));
};

export const getSettings = async () => {
  const snapshot = await getDocs(settingsRef);
  return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
};

export const getSystemSettings = async () => {
  const settingDoc = doc(settingsRef, 'system-settings');
  const snapshot = await getDoc(settingDoc);
  return snapshot.exists() ? snapshot.data() : null;
};

export const updateSetting = async (id, payload) => {
  const settingDoc = doc(settingsRef, id);
  await setDoc(settingDoc, { ...payload, updatedAt: Timestamp.now() }, { merge: true });
};

export const updateSystemSettings = async (payload) => {
  const settingDoc = doc(settingsRef, 'system-settings');
  await setDoc(settingDoc, { ...payload, updatedAt: Timestamp.now() }, { merge: true });
};

export const logEvent = async (payload) => {
  await addDoc(logsRef, {
    ...payload,
    timestamp: Timestamp.now(),
  });
};
