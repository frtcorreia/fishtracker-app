import { db, storage, auth } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import type { Profile } from '../types/profile';

export async function getProfile(userId: string): Promise<Profile | null> {
  const docRef = doc(db, 'profiles', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Profile;
  }
  
  return null;
}

export async function updateUserProfile(
  userId: string,
  data: Partial<Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>,
  photo?: File
): Promise<void> {
  let photoURL = data.photoURL;

  if (photo) {
    // Delete old photo if it exists
    if (data.photoURL) {
      const oldPhotoRef = ref(storage, data.photoURL);
      await deleteObject(oldPhotoRef).catch(() => {});
    }

    // Upload new photo
    const storageRef = ref(storage, `profiles/${userId}_${Date.now()}_${photo.name}`);
    await uploadBytes(storageRef, photo);
    photoURL = await getDownloadURL(storageRef);

    // Update auth profile
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL });
    }
  }

  const profileRef = doc(db, 'profiles', userId);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    await updateDoc(profileRef, {
      ...data,
      photoURL,
      updatedAt: new Date().toISOString(),
    });
  } else {
    await setDoc(profileRef, {
      userId,
      ...data,
      photoURL,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Update display name in auth profile
  if (data.displayName && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: data.displayName });
  }
}