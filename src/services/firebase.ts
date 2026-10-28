import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  onSnapshot,
  getDocFromServer,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, UserRole } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with configured databaseId (MANDATORY per Firebase skill)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});

// Standard Operation Types for error tracing
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Test Connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection verified');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network restricted.');
    }
  }
}

// User Document Interface in Firestore
export interface FirestoreUserData {
  id: string;
  email: string;
  name: string;
  role: 'Owner' | 'Driver' | 'Fleet Manager' | 'Admin' | 'Dispatcher' | 'Maintenance Manager';
  company?: string;
  avatar?: string;
  phone?: string;
  assignedVehicleId?: string;
  assignedVehicleReg?: string;
  driverLicense?: string;
  dutyStatus?: 'available' | 'driving' | 'break' | 'offline';
  createdAt: string;
  lastLoginAt: string;
}

// Fetch user profile from Firestore by UID
export async function fetchUserProfile(uid: string): Promise<FirestoreUserData | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as FirestoreUserData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// Save or update user profile in Firestore
export async function saveUserProfile(userData: FirestoreUserData): Promise<void> {
  const path = `users/${userData.id}`;
  try {
    await setDoc(doc(db, 'users', userData.id), {
      ...userData,
      lastLoginAt: new Date().toISOString()
    }, { merge: true });

    // Also record audit log
    await addDoc(collection(db, 'fleet_logs'), {
      userId: userData.id,
      userEmail: userData.email,
      action: 'user_profile_sync',
      details: `Profile updated for ${userData.name} (${userData.role})`,
      timestamp: new Date().toISOString()
    }).catch(() => {});
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Log in with Google via Popup
export async function signInWithGooglePopup(): Promise<{
  firebaseUser: FirebaseUser;
  existingProfile: FirestoreUserData | null;
}> {
  const result = await signInWithPopup(auth, googleAuthProvider);
  const fbUser = result.user;
  
  // Check if user already exists in Firestore
  const existingProfile = await fetchUserProfile(fbUser.uid);
  
  // Log login event
  try {
    await addDoc(collection(db, 'fleet_logs'), {
      userId: fbUser.uid,
      userEmail: fbUser.email || '',
      action: 'login_google',
      details: existingProfile ? `Connected existing Google account: ${existingProfile.role}` : 'New Google authentication',
      timestamp: new Date().toISOString()
    });
  } catch {
    // Ignore non-fatal log write error
  }

  return { firebaseUser: fbUser, existingProfile };
}

// Sign Out
export async function logOutFirebase(): Promise<void> {
  await fbSignOut(auth);
}
