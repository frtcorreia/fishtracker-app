import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { Settings } from '../types/settings';

const DEFAULT_SETTINGS: Omit<Settings, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  notifications: {
    email: true,
    push: true,
  },
  privacy: {
    profileVisibility: 'public',
    showLocation: true,
    showCatches: true,
  },
  preferences: {
    weightUnit: 'kg',
    lengthUnit: 'cm',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
};

export async function getSettings(userId: string): Promise<Settings | null> {
  const docRef = doc(db, 'settings', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Settings;
  }
  
  return null;
}

export async function updateSettings(
  userId: string,
  data: Partial<Omit<Settings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const settingsRef = doc(db, 'settings', userId);
  const settingsSnap = await getDoc(settingsRef);

  if (settingsSnap.exists()) {
    await updateDoc(settingsRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } else {
    await setDoc(settingsRef, {
      userId,
      ...DEFAULT_SETTINGS,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}