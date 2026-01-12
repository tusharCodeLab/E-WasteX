"use client";

import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Circle } from '@react-google-maps/api';
import { Loader2, MapPin } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '250px',
  borderRadius: '1rem'
};

interface CityPreviewProps {
  lat: number;
  lng: number;
  city: string;
  area: string;
}

const CityPreview: React.FC<CityPreviewProps> = ({ lat, lng, city, area }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const center = { lat, lng };

  if (!isLoaded) return (
    <div className="h-[250px] w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
        <MapPin className="w-4 h-4 text-emerald-500" />
        <span>{area}, {city}</span>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          options={{
            disableDefaultUI: true,
            gestureHandling: 'none',
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          }}
        >
          <Circle
            center={center}
            radius={2000} // 2km radius to hide exact location
            options={{
              fillColor: '#10b981',
              fillOpacity: 0.2,
              strokeColor: '#10b981',
              strokeOpacity: 0.5,
              strokeWeight: 1,
            }}
          />
        </GoogleMap>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 shadow-xl">
          Approximate Location
        </div>
      </div>
    </div>
  );
};

export default CityPreview;
