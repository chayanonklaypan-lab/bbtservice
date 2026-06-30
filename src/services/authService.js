import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const userDoc = doc(db, 'users', user.uid);

  await setDoc(userDoc, {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    role: 'Operator',
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  return user;
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const getUserProfile = async (uid) => {
  const userDoc = doc(db, 'users', uid);
  const snapshot = await getDoc(userDoc);
  return snapshot.exists() ? snapshot.data() : null;
};
