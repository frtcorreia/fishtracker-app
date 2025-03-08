export interface Settings {
  id: string;
  userId: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showLocation: boolean;
    showCatches: boolean;
  };
  preferences: {
    weightUnit: 'kg' | 'lb';
    lengthUnit: 'cm' | 'in';
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
  };
  createdAt: string;
  updatedAt: string;
}