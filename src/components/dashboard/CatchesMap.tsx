import React from 'react';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { Catch } from '../../types/catch';

const fishIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface CatchesMapProps {
  catches: Catch[];
  center: [number, number];
  loading: boolean;
  onViewDetails: (id: string) => void;
}

export function CatchesMap({ catches, center, loading, onViewDetails }: CatchesMapProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="h-80 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.map.title')}
        </h3>
        <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="h-80 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <MapContainer
          center={center}
          zoom={10}
          className="h-full w-full z-10"
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name={t('catches.form.sections.location.mapType.street')}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name={t('catches.form.sections.location.mapType.satellite')}>
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          {catches.map((catch_) => (
            <Marker
              key={catch_.id}
              position={[catch_.location.coordinates.lat, catch_.location.coordinates.lng]}
              icon={fishIcon}
            >
              <Popup>
                <div className="text-sm space-y-2">
                  <div className="font-medium text-gray-900">
                    {catch_.catch.species}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span>{catch_.catch.weight}g</span>
                    {catch_.catch.length && (
                      <span className="ml-2">{catch_.catch.length}cm</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600">
                    {catch_.date} {catch_.time}
                  </div>
                  <button
                    onClick={() => onViewDetails(catch_.id)}
                    className="w-full mt-2 inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    {t('dashboard.map.details.viewDetails')}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}