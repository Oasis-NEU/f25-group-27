/// <reference types="google.maps" />
import { useState, useEffect, useRef } from 'react';
import { Check, Map, X } from 'lucide-react';


interface Location {
  lat: number;
  lng: number;
}

export default function StreetViewApp() {

  // CONFIGURE YOUR LOCATION HERE
  const INITIAL_LOCATION: Location = { lat: 42.3404458, lng: -71.088525 }; // Kretzman Quad
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
            fullscreenControl: false,
            motionTracking: true,
            motionTrackingControl: true,
            linksControl: false,
            clickToGo: false,

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
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Add click listener to place or move marker
      mapInstanceRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const clickedLocation = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };

          console.log('Map clicked at:', clickedLocation);

          //If marker doesn't exist, create it. Otherwise, move it.
          if (!markerRef.current && mapInstanceRef.current) {
          markerRef.current = new window.google.maps.Marker({
            position: clickedLocation,
            map: mapInstanceRef.current,
            title: 'Current Guess',
            draggable: false,
          });
        } else if (markerRef.current) {
          markerRef.current.setPosition(clickedLocation);
        }
        }
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
          onClick={() => {
            console.log("Show map clicked");
            setShowMap(true); }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold z-50"
        >
          <Map size={20} />
          Show Map
        </button>
      )}

      {/* Sliding Map Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-2xl transition-transform duration-500 ease-in-out z-50 ${
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

        {/* Confirm Guess Button - Fixed at bottom center */}
        <button
          onClick={() => {
            if (markerRef.current) {
              const guessedPosition = {
                lat: markerRef.current.getPosition()!.lat(),
                lng: markerRef.current.getPosition()!.lng(),
              }
              console.log('Confirmed Guess at:', guessedPosition);

              const difference = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(guessedPosition.lat, guessedPosition.lng),
                new google.maps.LatLng(INITIAL_LOCATION.lat, INITIAL_LOCATION.lng)
              );
              console.log('Distance from actual location:', difference);

              if (difference < 125) {
                console.log('Great job! You are very close!');
              } else {
                console.log('You lose! Final distance:', difference);
              }
          };
        }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold z-50"
          >
            <Check size={20} />
            Confirm Guess
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