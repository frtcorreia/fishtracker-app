import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Fish, Save, Loader2, Cloud, Wind, Droplets, Moon, Gauge } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useAuthStore } from '../../store/authStore';
import { useCatchesStore } from '../../store/catchesStore';
import { getWeatherData } from '../../lib/weather';
import { FormInput, FormSelect, FormImageUpload, FormSection, FormTextarea } from '../../components/form';

import 'leaflet/dist/leaflet.css';

const fishIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationPicker({ position, onPositionChange }: {
  position: { lat: number; lng: number };
  onPositionChange: (pos: { lat: number; lng: number }) => void;
}) {
  const map = useMap();

  useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
    },
  });

  useEffect(() => {
    map.setView([position.lat, position.lng]);
  }, [position, map]);

  return <Marker position={position} icon={fishIcon} />;
}

export function CatchForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { catches, loading, addCatch, updateCatch } = useCatchesStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    species: 'bass' as const,
    weight: '',
    length: '',
    technique: '',
    bait: '',
    depth: '',
    techniqueNotes: '',
    observations: '',
    visibility: 'private' as const,
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingLocation(false);
        },
        () => {
          setPosition({ lat: 40.7128, lng: -74.0060 });
          setLoadingLocation(false);
        }
      );
    } else {
      setPosition({ lat: 40.7128, lng: -74.0060 });
      setLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const catch_ = catches.find(c => c.id === id);
      if (catch_) {
        setFormData({
          date: catch_.date,
          time: catch_.time,
          species: catch_.catch.species,
          weight: catch_.catch.weight?.toString() || '',
          length: catch_.catch.length?.toString() || '',
          technique: catch_.technique?.method || '',
          bait: catch_.technique?.bait || '',
          depth: catch_.technique?.depth?.toString() || '',
          techniqueNotes: catch_.technique?.notes || '',
          observations: catch_.catch.notes || '',
          visibility: catch_.visibility,
        });
        setPosition(catch_.location.coordinates);
        setImagePreview(catch_.catch.imageUrl || null);
      }
    }
  }, [id, catches]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!position || !formData.date || !formData.time) return;
      
      setLoadingWeather(true);
      try {
        const data = await getWeatherData(position.lat, position.lng, formData.date, formData.time);
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeatherData();
  }, [position, formData.date, formData.time]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !position) return;

    if (!formData.date || !formData.time || !formData.weight || !formData.length) {
      alert(t('catches.form.errors.requiredFields'));
      return;
    }

    try {
      const catchData = {
        userId: user.uid,
        date: formData.date,
        time: formData.time,
        catch: {
          species: formData.species,
          weight: parseFloat(formData.weight),
          length: parseFloat(formData.length),
          imageUrl: imagePreview,
          notes: formData.observations,
        },
        location: {
          coordinates: position,
        },
        technique: {
          method: formData.technique,
          bait: formData.bait,
          depth: parseFloat(formData.depth),
          notes: formData.techniqueNotes,
        },
        visibility: formData.visibility,
        weather: weatherData ? {
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          pressure: weatherData.pressure,
          wind: {
            speed: weatherData.wind.speed,
            direction: weatherData.wind.direction,
          },
          precipitation: weatherData.precipitation,
          sky: weatherData.sky,
          visibility: weatherData.visibility,
        } : undefined,
        moonPhase: weatherData?.moonPhase,
      };

      if (id) {
        await updateCatch(id, catchData, imageFile || undefined);
      } else {
        await addCatch(catchData, imageFile || undefined);
      }
      
      navigate('/catches');
    } catch (error) {
      console.error('Error saving catch:', error);
      alert(t('catches.form.errors.saveFailed'));
    }
  };

  const speciesOptions = [
    { value: 'bass', label: t('catches.form.sections.species.options.bass') },
    { value: 'carp', label: t('catches.form.sections.species.options.carp') },
    { value: 'barbel', label: t('catches.form.sections.species.options.barbel') },
    { value: 'pike', label: t('catches.form.sections.species.options.pike') },
    { value: 'zander', label: t('catches.form.sections.species.options.zander') },
    { value: 'perch', label: t('catches.form.sections.species.options.perch') },
  ];

  const visibilityOptions = [
    { value: 'private', label: t('catches.form.sections.visibility.options.private') },
    { value: 'public', label: t('catches.form.sections.visibility.options.public') },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {id ? t('catches.form.titleEdit') : t('catches.form.titleNew')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Species Selection */}
        <FormSection title={t('catches.form.sections.species.title')}>
          <FormSelect
            label={t('catches.form.sections.species.label')}
            options={speciesOptions}
            icon={Fish}
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value as any })}
          />
        </FormSection>

        {/* Image Upload */}
        <FormImageUpload
          label={t('catches.form.sections.photo.title')}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onImageRemove={() => {
            setImageFile(null);
            setImagePreview(null);
          }}
          uploadText={t('catches.form.sections.photo.upload')}
          dragDropText={t('catches.form.sections.photo.dragDrop')}
          formatsText={t('catches.form.sections.photo.formats')}
        />

        {/* Details */}
        <FormSection title={t('catches.form.sections.details.title')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              type="number"
              step="1"
              required
              label={t('catches.form.sections.details.weight')}
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
            <FormInput
              type="number"
              step="0.1"
              required
              label={t('catches.form.sections.details.length')}
              value={formData.length}
              onChange={(e) => setFormData({ ...formData, length: e.target.value })}
            />
          </div>
        </FormSection>

        {/* Fishing Method */}
        <FormSection title={t('catches.form.sections.technique.title')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label={t('catches.form.sections.technique.technique.label')}
              placeholder={t('catches.form.sections.technique.technique.placeholder')}
              value={formData.technique}
              onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
            />
            <FormInput
              label={t('catches.form.sections.technique.bait.label')}
              placeholder={t('catches.form.sections.technique.bait.placeholder')}
              value={formData.bait}
              onChange={(e) => setFormData({ ...formData, bait: e.target.value })}
            />
            <div className="md:col-span-2">
              <FormInput
                type="number"
                step="0.1"
                label={t('catches.form.sections.technique.depth.label')}
                placeholder={t('catches.form.sections.technique.depth.placeholder')}
                value={formData.depth}
                onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <FormTextarea
                label={t('catches.form.sections.technique.notes.label')}
                placeholder={t('catches.form.sections.technique.notes.placeholder')}
                value={formData.techniqueNotes}
                onChange={(e) => setFormData({ ...formData, techniqueNotes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </FormSection>

        {/* Date and Time */}
        <FormSection title={t('catches.form.sections.datetime.title')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              type="date"
              required
              label={t('catches.form.sections.datetime.date')}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <FormInput
              type="time"
              required
              label={t('catches.form.sections.datetime.time')}
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </FormSection>

        {/* Location */}
        <FormSection title={t('catches.form.sections.location.title')}>
          {loadingLocation ? (
            <div className="h-[400px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : position ? (
            <div className="h-[400px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 relative">
              <MapContainer
                center={[position.lat, position.lng]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker
                  position={position}
                  onPositionChange={setPosition}
                />
              </MapContainer>
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormInput
              type="number"
              step="0.000001"
              label={t('catches.form.sections.location.latitude')}
              value={position?.lat || ''}
              onChange={(e) => setPosition({ ...position!, lat: parseFloat(e.target.value) })}
            />
            <FormInput
              type="number"
              step="0.000001"
              label={t('catches.form.sections.location.longitude')}
              value={position?.lng || ''}
              onChange={(e) => setPosition({ ...position!, lng: parseFloat(e.target.value) })}
            />
          </div>
        </FormSection>

        {/* Weather Data */}
        {loadingWeather ? (
          <FormSection title={t('catches.form.sections.weather.title')}>
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {t('catches.form.sections.weather.loading')}
              </span>
            </div>
          </FormSection>
        ) : weatherData ? (
          <FormSection title={t('catches.form.sections.weather.title')}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Cloud className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('catches.form.sections.weather.temperature')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {weatherData.temperature}°C
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Droplets className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('catches.form.sections.weather.humidity')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {weatherData.humidity}%
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Gauge className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('catches.form.sections.weather.pressure')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {weatherData.pressure} hPa
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Wind className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('catches.form.sections.weather.wind')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {weatherData.wind.speed} km/h {weatherData.wind.direction}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Cloud className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('catches.form.sections.weather.sky')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {weatherData.sky}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('catches.form.sections.weather.moonPhase')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {weatherData.moonPhase}
                  </p>
                </div>
              </div>
            </div>
          </FormSection>
        ) : null}

        {/* Observations */}
        <FormSection title={t('catches.form.sections.observations.title')}>
          <FormTextarea
            label={t('catches.form.sections.observations.label')}
            placeholder={t('catches.form.sections.observations.placeholder')}
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            rows={4}
          />
        </FormSection>

        {/* Visibility */}
        <FormSection title={t('catches.form.sections.visibility.title')}>
          <FormSelect
            label={t('catches.form.sections.visibility.title')}
            options={visibilityOptions}
            value={formData.visibility}
            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'private' | 'public' })}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('catches.form.sections.visibility.description')}
          </p>
        </FormSection>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/catches')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {id ? t('common.update') : t('common.save')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}