import React, { useState, useEffect } from "react";
import { MapPin } from 'lucide-react';

export default function MyLocation() { 
  const [location, setLocation] = useState("Carregando...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
 
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();

        if (data && data.address) {
          setLocation(data.address.city || data.address.town || "Local desconhecido");
        } else {
          setLocation("Não foi possível obter a localização");
        }
      }, () => {
        setLocation("Permissão negada para obter a localização");
      });
    } else {
      setLocation("Geolocalização não é suportada pelo seu navegador");
    }
  }, []);

  return ( 
      <div className="flex items-center justify-center mb-2">
          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
            {location}
          </span>
     </div> 
       
  );
};
 
