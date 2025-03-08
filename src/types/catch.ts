export interface Catch {
  id: string;
  userId: string;
  date: string;
  time: string;
  catch: {
    species: 'bass' | 'carp' | 'barbel' | 'pike' | 'zander' | 'perch';
    weight: number;
    length: number;
    imageUrl?: string;
    notes?: string;
  };
  location: {
    coordinates: {
      lat: number;
      lng: number;
    };
    name?: string;
    type?: 'river' | 'lake' | 'sea' | 'reservoir' | 'pond';
    depth?: number;
    notes?: string;
  };
  technique?: {
    method: string;
    bait: string;
    depth: number;
  };
  weather?: {
    temperature: number;
    humidity: number;
    pressure: number;
    wind: {
      speed: number;
      direction: string;
    };
    precipitation: number;
    sky: 'clear' | 'partly-cloudy' | 'cloudy' | 'overcast' | 'rain' | 'storm';
    visibility: number;
  };
  water?: {
    temperature?: number;
    clarity?: 'clear' | 'slightly-murky' | 'murky' | 'very-murky';
    depth?: number;
    current?: 'none' | 'slow' | 'moderate' | 'strong';
    type?: 'fresh' | 'salt' | 'brackish';
  };
  moonPhase?: string;
  visibility: 'private' | 'public';
  createdAt: string;
  updatedAt: string;
}