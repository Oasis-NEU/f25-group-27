/// <reference types="google.maps" />
import { useState, useEffect, useRef } from 'react';
import { Map, X } from 'lucide-react';


interface Location {
  lat: number;
  lng: number;
}

export default function StreetViewApp() {

  // CONFIGURE YOUR LOCATION HERE
  const INITIAL_LOCATION: Location = { lat: 40.7580, lng: -73.9855 }; // Times Square, New York
  const INITIAL_HEADING: number = 165; // Direction the camera is facing (0-360)
  const INITIAL_PITCH: number = 0; // Vertical angle (-90 to 90)
  const INITIAL_ZOOM: number = 1; // Zoom level (0-4)
  
  // Replace with your actual API key
  const API_KEY: string = 'AIzaSyCo-qJ6-o4jR5EX-zocrl5B8yegOxmWRSI';

  const [showMap, setShowMap] = useState<boolean>(false);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps already loaded');
      if (streetViewRef.current) {
        new window.google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: INITIAL_LOCATION,
            pov: { 
              heading: INITIAL_HEADING, 
              pitch: INITIAL_PITCH 
            },
            zoom: INITIAL_ZOOM,
            addressControl: false,
            fullscreenControl: true,
            motionTracking: true,
            motionTrackingControl: true,
          }
        );
      }
      return;
    }

    // Load Google Maps API
    console.log('Loading Google Maps API...');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      // Initialize Street View panorama
      if (streetViewRef.current) {
        new window.google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: INITIAL_LOCATION,
            pov: { 
              heading: INITIAL_HEADING, 
              pitch: INITIAL_PITCH 
            },
            zoom: INITIAL_ZOOM,
            addressControl: false,
            fullscreenControl: true,
            motionTracking: true,
            motionTrackingControl: true,
          }
        );
      }
    };
    script.onerror = (error) => {
      console.error('Failed to load Google Maps API:', error);
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (showMap && mapRef.current && window.google && !mapInstanceRef.current) {
      // Initialize the map
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: INITIAL_LOCATION,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: false,
      });

      // Add a marker at the location
      markerRef.current = new window.google.maps.Marker({
        position: INITIAL_LOCATION,
        map: mapInstanceRef.current,
        title: 'Street View Location',
      });
    }
  }, [showMap]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Street View Container */}
      <div 
        ref={streetViewRef}
        className="w-full h-full"
      />

      {/* Map Button - Fixed at bottom center */}
      {!showMap && (
        <button
          onClick={() => setShowMap(true)}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold z-50"
        >
          <Map size={20} />
          Show Map
        </button>
      )}

      {/* Sliding Map Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-2xl transition-transform duration-500 ease-in-out ${
          showMap ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '60vh' }}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowMap(false)}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition z-10"
        >
          <X size={24} />
        </button>

        {/* Map Container */}
        <div 
          ref={mapRef}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}