export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  favoriteSpecies?: string[];
  status: 'waitingList' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}