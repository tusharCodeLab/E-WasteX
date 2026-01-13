"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Loader2, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1rem'
};

const defaultCenter = {
  lat: 23.8103,
  lng: 90.4125 // Dhaka, default
};

interface LocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    area: string;
  }) => void;
  initialLocation?: { lat: number; lng: number };
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral>(initialLocation || defaultCenter);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    if (!window.google) return;
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        const result = response.results[0];
        let city = '';
        let area = '';
        
        result.address_components.forEach(component => {
          if (component.types.includes('locality')) city = component.long_name;
          if (component.types.includes('sublocality') || component.types.includes('neighborhood')) {
            area = component.long_name;
          }
        });

        onLocationSelect({
          lat,
          lng,
          address: result.formatted_address,
          city: city || 'Unknown City',
          area: area || city || 'Unknown Area'
        });
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  }, [onLocationSelect]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(newPos);
      reverseGeocode(newPos.lat, newPos.lng);
    }
  }, [reverseGeocode]);

  const handleSearch = async () => {
    if (!searchQuery || !window.google) return;
    setLoading(true);
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ address: searchQuery });
      if (response.results[0]) {
        const location = response.results[0].geometry.location;
        const newPos = { lat: location.lat(), lng: location.lng() };
        setMarkerPosition(newPos);
        map?.panTo(newPos);
        reverseGeocode(newPos.lat, newPos.lng);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return (
    <div className="h-[400px] w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search for your location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      <div className="relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition}
          zoom={15}
          onClick={onMapClick}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            clickableIcons: false,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          }}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
        <div className="absolute top-4 right-4 bg-white dark:bg-zinc-900 p-2 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 pointer-events-none">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <MapPin className="w-3 h-3" />
            <span>Click to pin location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
