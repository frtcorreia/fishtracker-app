import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import { 
  Fish, 
  MapPin, 
  Calendar, 
  Scale, 
  Moon, 
  Droplets, 
  ArrowLeft,
  Thermometer,
  Gauge,
  Cloud,
  Wind,
  Eye,
  Maximize2,
  Download
} from 'lucide-react';
import { useCatchesStore } from '../../store/catchesStore';
import { ImageViewer } from '../../components/ImageViewer';
import type { Catch } from '../../types/catch';

import 'leaflet/dist/leaflet.css';

const fishIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function CatchView() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { catches } = useCatchesStore();
  const [catch_, setCatch] = useState<Catch | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);

  useEffect(() => {
    if (id) {
      const foundCatch = catches.find(c => c.id === id);
      if (foundCatch) {
        setCatch(foundCatch);
      }
    }
  }, [id, catches]);

  const handleDownload = async () => {
    if (!catch_?.catch.imageUrl) return;
    
    try {
      const response = await fetch(catch_.catch.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `catch-${catch_.id}.${blob.type.split('/')[1]}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (!catch_) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">
          {t('catches.view.notFound')}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/catches')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('catches.view.backToList')}
        </button>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            catch_.visibility === 'public' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          }`}>
            {t(`catches.list.details.visibility.${catch_.visibility}`)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Image */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {catch_.catch.imageUrl ? (
              <div className="relative group">
                <div className="relative pb-[75%]">
                  <img
                    src={catch_.catch.imageUrl}
                    alt={t('catches.list.details.species')}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                {/* Image Controls */}
                <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setShowImageViewer(true)}
                    className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    title="View full screen"
                  >
                    <Maximize2 className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    title="Download image"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Fish className="w-20 h-20 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('catches.view.details.title')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Fish className="w-5 h-5 mr-2" />
                  {t('catches.view.details.species')}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {catch_.catch.species}
                </span>
              </div>
              {catch_.catch.weight && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Scale className="w-5 h-5 mr-2" />
                    {t('catches.view.details.weight')}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {catch_.catch.weight}g
                  </span>
                </div>
              )}
              {catch_.catch.length && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Scale className="w-5 h-5 mr-2" />
                    {t('catches.view.details.length')}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {catch_.catch.length}cm
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-5 h-5 mr-2" />
                  {t('catches.view.details.dateTime')}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {catch_.date} {catch_.time}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Map */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('catches.view.location.title')}
            </h2>
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <MapContainer
                center={[catch_.location.coordinates.lat, catch_.location.coordinates.lng]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[catch_.location.coordinates.lat, catch_.location.coordinates.lng]}
                  icon={fishIcon}
                />
              </MapContainer>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {t('catches.view.location.coordinates')}: {catch_.location.coordinates.lat.toFixed(6)}, {catch_.location.coordinates.lng.toFixed(6)}
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('catches.view.conditions.title')}
            </h2>
            
            {/* Weather Conditions */}
            {catch_.weather && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">
                  {t('catches.view.conditions.weather.title')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Thermometer className="w-4 h-4 mr-2" />
                      {t('catches.view.conditions.weather.temperature')}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {catch_.weather.temperature}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Droplets className="w-4 h-4 mr-2" />
                      {t('catches.view.conditions.weather.humidity')}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {catch_.weather.humidity}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Gauge className="w-4 h-4 mr-2" />
                      {t('catches.view.conditions.weather.pressure')}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {catch_.weather.pressure} hPa
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Wind className="w-4 h-4 mr-2" />
                      {t('catches.view.conditions.weather.wind')}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {catch_.weather.wind.speed} km/h {catch_.weather.wind.direction}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Cloud className="w-4 h-4 mr-2" />
                      {t('catches.view.conditions.weather.sky')}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {catch_.weather.sky}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Eye className="w-4 h-4 mr-2" />
                      {t('catches.view.conditions.weather.visibility')}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {catch_.weather.visibility} km
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Water and Moon */}
            <div className="space-y-4">
              {catch_.water?.temperature && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Droplets className="w-5 h-5 mr-2" />
                    {t('catches.view.conditions.waterTemp')}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {catch_.water.temperature}°C
                  </span>
                </div>
              )}
              {catch_.moonPhase && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Moon className="w-5 h-5 mr-2" />
                    {t('catches.view.conditions.moonPhase')}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {catch_.moonPhase}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Viewer */}
      {showImageViewer && catch_.catch.imageUrl && (
        <ImageViewer
          imageUrl={catch_.catch.imageUrl}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  );
}