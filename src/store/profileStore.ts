import { create } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Profile } from '../types/profile';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  loadProfile: (userId: string) => Promise<void>;
  createProfile: (userId: string, data: Partial<Profile>) => Promise<void>;
  updateProfile: (userId: string, data: Partial<Profile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  loadProfile: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        set({ profile: { id: docSnap.id, ...docSnap.data() } as Profile });
      } else {
        set({ profile: null });
      }
    } catch (error) {
      set({ error: 'Error loading profile' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createProfile: async (userId: string, data: Partial<Profile>) => {
    set({ loading: true, error: null });
    try {
      const profile: Profile = {
        id: userId,
        userId,
        displayName: '',
        email: '',
        status: 'waitingList',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      };

      await setDoc(doc(db, 'profiles', userId), profile);
      set({ profile });
    } catch (error) {
      set({ error: 'Error creating profile' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (userId: string, data: Partial<Profile>) => {
    set({ loading: true, error: null });
    try {
      const docRef = doc(db, 'profiles', userId);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      set((state) => ({
        profile: state.profile
          ? { ...state.profile, ...data, updatedAt: new Date().toISOString() }
          : null,
      }));
    } catch (error) {
      set({ error: 'Error updating profile' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));