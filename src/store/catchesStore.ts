import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { Catch } from '../types/catch';

// Helper function to remove undefined values from an object
function removeUndefined(obj: any): any {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      if (value === undefined) return false;
      if (typeof value === 'object' && value !== null) {
        const cleaned = removeUndefined(value);
        return Object.keys(cleaned).length > 0;
      }
      return true;
    }).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return [key, removeUndefined(value)];
      }
      return [key, value];
    })
  );
}

interface CatchesState {
  catches: Catch[];
  loading: boolean;
  error: string | null;
  loadCatches: (userId: string) => Promise<void>;
  addCatch: (catchData: Omit<Catch, 'id' | 'createdAt' | 'updatedAt'>, image?: File) => Promise<string>;
  updateCatch: (id: string, catchData: Partial<Omit<Catch, 'id' | 'createdAt' | 'updatedAt'>>, image?: File) => Promise<void>;
  deleteCatch: (id: string, imageUrl?: string) => Promise<void>;
}

export const useCatchesStore = create<CatchesState>((set, get) => ({
  catches: [],
  loading: false,
  error: null,

  loadCatches: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const catchesQuery = query(
        collection(db, 'catches'),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        orderBy('time', 'desc')
      );

      const snapshot = await getDocs(catchesQuery);
      const catches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Catch));
      set({ catches, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar capturas', loading: false });
      throw error;
    }
  },

  addCatch: async (catchData, image) => {
    set({ loading: true, error: null });
    try {
      let imageUrl;
      
      if (image) {
        const storageRef = ref(storage, `catches/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const cleanedData = removeUndefined({
        ...catchData,
        catch: {
          ...catchData.catch,
          imageUrl
        }
      });

      const docRef = await addDoc(collection(db, 'catches'), {
        ...cleanedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const newCatch = {
        id: docRef.id,
        ...cleanedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Catch;

      set(state => ({ 
        catches: [newCatch, ...state.catches],
        loading: false 
      }));

      return docRef.id;
    } catch (error) {
      set({ error: 'Erro ao adicionar captura', loading: false });
      throw error;
    }
  },

  updateCatch: async (id, catchData, image) => {
    set({ loading: true, error: null });
    try {
      let imageUrl = catchData.catch?.imageUrl;

      if (image) {
        // Delete old image if it exists
        if (catchData.catch?.imageUrl) {
          const oldImageRef = ref(storage, catchData.catch.imageUrl);
          await deleteObject(oldImageRef).catch(() => {});
        }

        // Upload new image
        const storageRef = ref(storage, `catches/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const cleanedData = removeUndefined({
        ...catchData,
        catch: {
          ...catchData.catch,
          imageUrl
        }
      });

      await updateDoc(doc(db, 'catches', id), {
        ...cleanedData,
        updatedAt: new Date().toISOString(),
      });

      set(state => ({
        catches: state.catches.map(catch_ => 
          catch_.id === id 
            ? { ...catch_, ...cleanedData, updatedAt: new Date().toISOString() }
            : catch_
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Erro ao atualizar captura', loading: false });
      throw error;
    }
  },

  deleteCatch: async (id, imageUrl) => {
    set({ loading: true, error: null });
    try {
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef).catch(() => {});
      }
      
      await deleteDoc(doc(db, 'catches', id));
      
      set(state => ({
        catches: state.catches.filter(catch_ => catch_.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Erro ao excluir captura', loading: false });
      throw error;
    }
  },
}));