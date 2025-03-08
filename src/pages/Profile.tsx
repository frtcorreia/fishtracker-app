import React, { useState, useEffect } from 'react';
import { Upload, X, Save, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { getProfile, updateUserProfile } from '../lib/profile';
import { FormInput, FormSection, FormImageUpload, FormTextarea } from '../components/form';
import type { Profile } from '../types/profile';

const FAVORITE_SPECIES = [
  'Bass', 'Trout', 'Pike', 'Carp', 'Catfish', 'Perch', 'Zander', 'Barbel'
];

export function Profile() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '', 
    location: '',
    favoriteSpecies: [] as string[],
  });
   
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const profile = await getProfile(user.uid);
      if (profile) {
        setFormData({
          displayName: profile.displayName || user.displayName || '',
          email: profile.email || user.email || '',
          bio: profile.bio || '',
          location: profile.location || '',
          favoriteSpecies: profile.favoriteSpecies || [],
        });
        setPhotoPreview(profile.photoURL || user.photoURL || null);
      } else {
        setFormData({
          displayName: user.displayName || '',
          email: user.email || '',
          bio: '',
          location: '',
          favoriteSpecies: [],
        });
        setPhotoPreview(user.photoURL || null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        ...formData,
        photoURL: photoPreview,
      }, imageFile);
 
      await loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleFavoriteSpecies = (species: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteSpecies: prev.favoriteSpecies.includes(species)
        ? prev.favoriteSpecies.filter(s => s !== species)
        : [...prev.favoriteSpecies, species],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t('profile.title')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <FormImageUpload
          label={t('profile.photo.title')}
          imagePreview={photoPreview}
          onImageChange={handleImageChange}
          onImageRemove={() => {
            setImageFile(null);
            setPhotoPreview(null);
          }}
          uploadText={t('profile.photo.upload')}
          dragDropText={t('profile.photo.dragDrop')}
          formatsText={t('profile.photo.formats')}
        />

        {/* Basic Information */}
        <FormSection title={t('profile.basicInfo.title')}>
          <div className="space-y-6">
            <FormInput
              type="text"
              required
              label={t('profile.basicInfo.displayName.label')}
              placeholder={t('profile.basicInfo.displayName.placeholder')}
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />

            <FormInput
              type="email"
              required
              disabled
              label={t('profile.basicInfo.email.label')}
              value={formData.email}
              helperText={t('profile.basicInfo.email.cannotChange')}
            />
 
            <FormInput
              type="text"
              label={t('profile.basicInfo.location.label')}
              placeholder={t('profile.basicInfo.location.placeholder')}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </FormSection>

        {/* Favorite Species */}
        <FormSection title={t('profile.favoriteSpecies.title')}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t('profile.favoriteSpecies.description')}
          </p>
          <div className="flex flex-wrap gap-2">
            {FAVORITE_SPECIES.map((species) => (
              <button
                key={species}
                type="button"
                onClick={() => toggleFavoriteSpecies(species)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  formData.favoriteSpecies.includes(species)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {species}
              </button>
            ))}
          </div>
        </FormSection>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('profile.buttons.saving')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t('profile.buttons.saveChanges')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}