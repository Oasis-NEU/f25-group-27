/// <reference types="google.maps" />
import { useState, useEffect, useRef } from 'react';
import { Check, Map, X, BarChart3 } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
}

export default function StreetViewApp() {

  // LOCATIONS
  const MARINO: Location = { lat: 42.3398567, lng: -71.0907273 } // Approximate Center of Campus
  const CABOT: Location = { lat: 42.3397469, lng: -71.089287 } // Approximate Center of Campus
  const MUGAR: Location = { lat: 42.3394737, lng: -71.086873 } // Approximate Center of Campus
  const EV: Location = { lat: 42.3402671, lng: -71.0868493 } // Approximate Center of Campus
  const STEAST: Location = { lat: 42.3409249, lng: -71.0898761 } // Approximate Center of Campus
  const CATHOLIC_CENTER: Location = { lat: 42.3417765, lng: -71.0876946 } // Approximate Center of Campus
  const MASS300: Location = { lat: 42.34344746989925, lng: -71.08563281045348 } // Approximate Center of Campus
  const SHERATON: Location = { lat: 42.34591594539982, lng: -71.0835674735219 } // Approximate Center of Campus
  const MIDTOWN: Location = { lat: 42.34405670960164, lng: -71.08353192101417 } // Approximate Center of Campus
  const CHRISTIAN_SCIENCE: Location = { lat: 42.34481566080893, lng: -71.08394962188773 } // Approximate Center of Campus
  const CAMPUS_CENTER: Location = { lat: 42.339015298689084, lng: -71.08872168679216 } // Approximate Center of Campus
  const KRETZMAN_QUAD: Location = { lat: 42.3404458, lng: -71.088525 }; // Kretzman Quad
  const FENWAY_PATH: Location = { lat: 42.3409852, lng: -71.0914785 }; // Along the path to fenway north of Stwest
  const RUGGLES_STATION: Location = { lat: 42.3361246, lng: 71.0887778 }; // Ruggles T Station
  const WAR_MEMORIAL: Location = { lat: 42.3377552, lng: -71.089432 }; // War Memorial 
  const CENTENIAL: Location = { lat: 42.3370999, lng: -71.0905084 }; //Centennial Common
  const ISEC_INSIDE: Location = { lat: 42.3375038, lng: -71.086988 }; // Inside ISEC Building
  
  //NOT WORKING RIGHT NOW
  const RUGGLES_OUTSIDE: Location = { lat: 42.336523, lng: -71.0900415 }; // Outside Ruggles T Station
  const BURNSTEIN: Location = { lat: 42.3384075, lng: -71.0930882 }; //Burnstein Hall Courtyard
  
  const CARTER_FIELD: Location = { lat: 42.3394581, lng: -71.0846094 }; // Carter Field
  const IV_COURTYARD: Location = { lat: 42.3351058, lng: -71.0892139 }; // International Village Courtyard
  const WEST_CORNER: Location = { lat: 42.3370736, lng: -71.0936173 }; //West Corner of Campus
  const INITIAL_HEADING: number = 165; // Direction the camera is facing (0-360)
  const INITIAL_PITCH: number = 0; // Vertical angle (-90 to 90)
  const INITIAL_ZOOM: number = 1; // Zoom level (0-4)
  const VISITED_LOCATIONS = useRef(new Set<Location>());
  const ALL_LOCATIONS = useRef(new Set([MARINO, CABOT, MUGAR, EV, STEAST, CATHOLIC_CENTER, MASS300,
                            SHERATON, MIDTOWN, CHRISTIAN_SCIENCE, CAMPUS_CENTER, KRETZMAN_QUAD,
                            FENWAY_PATH, RUGGLES_STATION, WAR_MEMORIAL, CENTENIAL, ISEC_INSIDE, 
                            RUGGLES_OUTSIDE, BURNSTEIN, CARTER_FIELD, IV_COURTYARD, WEST_CORNER]));
  const CURRENT_LOCATION = useRef(chooseLoc());
  

  
  // Replace with your actual API key
  const API_KEY: string = 'AIzaSyCo-qJ6-o4jR5EX-zocrl5B8yegOxmWRSI';

  const [showResults, setShowResults] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number | null>(null);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const lineRef = useRef<google.maps.Polyline | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const actualLocationMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const hasGuessedRef = useRef<boolean>(false);
  const panoRef = useRef<google.maps.StreetViewPanorama>(null);

  function setEquality(setA: Set<Location>, setB: Set<Location>){
    
    if(setA.size == setB.size){

      for(const el of setA){
        if(!setB.has(el)){
          return false;
        }
      }

      return true;
    }
    return false;
  }

  function chooseLoc(){
    
    const possible_locations = new Set([...ALL_LOCATIONS.current])

    if(setEquality(possible_locations, VISITED_LOCATIONS.current)){
      VISITED_LOCATIONS.current = new Set<Location>()
      VISITED_LOCATIONS.current.add(CURRENT_LOCATION.current)
    }

    for(const loc of VISITED_LOCATIONS.current){
        possible_locations.delete(loc)
      }
    
    const location_array = Array.from(possible_locations)


    const loc_index = Math.floor((Math.random() * location_array.length))
    const location = location_array[loc_index]

    return location
  };
  

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps already loaded');
      if (streetViewRef.current) {
        panoRef.current = new window.google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: CURRENT_LOCATION.current,
            pov: { 
              heading: INITIAL_HEADING, 
              pitch: INITIAL_PITCH 
            },
            zoom: INITIAL_ZOOM,
            addressControl: false,
            fullscreenControl: true,
            motionTracking: true,
            motionTrackingControl: true,
            clickToGo: false,
            linksControl: false,
            showRoadLabels: false,
          }
        );
      }
      return;
    }

    // Load Google Maps API
    console.log('Loading Google Maps API...');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=marker,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      // Initialize Street View panorama
      if (streetViewRef.current) {
        panoRef.current = new window.google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: CURRENT_LOCATION.current,
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
            showRoadLabels: false,
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
        mapId: "Guessing-Map",
        center: CAMPUS_CENTER,
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      });

      // Add click listener to place or move marker
      mapInstanceRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
        // Stop from placing marker if player has guessed already.
        if (hasGuessedRef.current) return;

        if (e.latLng) {
          const clickedLocation = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };

          console.log('Map clicked at:', clickedLocation);

          //If marker doesn't exist, create it. Otherwise, move it.
          if (!markerRef.current && mapInstanceRef.current) {
          markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
            position: clickedLocation,
            map: mapInstanceRef.current,
            title: 'Current Guess',
            gmpDraggable: false,
          });
        } else if (markerRef.current) {
          markerRef.current.map = mapInstanceRef.current; // Ensure marker is on the map
          markerRef.current.position = clickedLocation;
        }
        }
      });
    }
  }, [showMap, CAMPUS_CENTER]);

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
        { !hasGuessedRef.current && (
        <button
          onClick={() => {

            // Set guessed location to the current marker position
            if (markerRef.current && markerRef.current.position) {
              const position = markerRef.current.position as google.maps.LatLng;
              const guessedPosition = {
                lat: position.lat,
                lng: position.lng,
              };

              console.log('Confirmed Guess at:', guessedPosition);

              // Calculate distance from actual location
              const difference = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(guessedPosition.lat, guessedPosition.lng),
                new google.maps.LatLng(CURRENT_LOCATION.current.lat, CURRENT_LOCATION.current.lng)
              );
              console.log('Distance from actual location:', difference, "meters.");

              // Calculate score based on distance
              const calculatedScore = Math.round(Math.min(1000, Math.max(0, (1000 * Math.exp(-3 * difference/1000) + 50))));

              setScore(calculatedScore);
              setDistance(difference);

              // Draw line between guessed location and actual location
              if (mapInstanceRef.current) {
                lineRef.current = new google.maps.Polyline({
                  path: [
                    { lat: guessedPosition.lat, lng: guessedPosition.lng },
                    { lat: CURRENT_LOCATION.current.lat, lng: CURRENT_LOCATION.current.lng }
                  ],
                  geodesic: true,
                  strokeColor: '#ff0000',
                  strokeOpacity: 1.0,
                  strokeWeight: 3,
                  visible: true,
                  map: mapInstanceRef.current,
                });

                // Add marker on the actual location
                actualLocationMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
                  position: CURRENT_LOCATION.current,
                  map: mapInstanceRef.current,
                  title: 'Actual Location',
                  gmpDraggable: false,
                  content: new google.maps.marker.PinElement({
                    background: 'limegreen',
                    borderColor: 'limegreen',
                    glyphColor: 'green',
                  }),
                });
              }

              // Make Results Panel Appear
              setShowResults(true);
              hasGuessedRef.current = true;

              
              if (score > 850) {
                console.log('Great job! You are very close!');
                console.log('Score: ', score);
              } else {
                console.log('Too far! Better luck next time.');
                console.log('Score: ', score);
              }
          };
        }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold z-50"
          >
            <Check size={20} />
            Confirm Guess
          </button>
        )}

        {/* View Results Button (only after guessing) */}
        { hasGuessedRef.current && (
          <button 
            onClick = {() => 
              setShowResults(true)
            }
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 -translate-y-4 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover: shadow-xl hover: bg-bluee-700 transition-all flex items-center gap-2 font-semibold z-50"
            >
              <BarChart3 size={20} />
              View Results
            </button>
        )}

        {/* Map Container */}
        <div 
          ref={mapRef}
          className="w-full h-full"
        />
      </div>

      {/* Results Panel */}
      { showResults && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-8 z-50 max-w-md w-full">
               {/* Close Button */}
          <button
            onClick={() => {
              setShowResults(false); 
              }
            }
            
            className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition"
          >
            <X size={20} />
          </button>

          {/* Results Content */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Results</h2>
            
            <div className="mb-6">
              <div className="text-6xl font-bold text-blue-600 mb-2">{score}</div>
              <div className="text-gray-600">Points</div>
            </div>

            <div className="mb-6">
              <div className="text-2xl font-semibold text-gray-700 mb-1">
                {distance !== null ? distance.toFixed(1) : 0} meters
              </div>
              <div className="text-gray-500">Distance from actual location</div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              {score > 850 ? (
                <p className="text-green-600 font-semibold text-lg">
                  🎉 Great job! You're very close!
                </p>
              ) : score > 500 ? (
                <p className="text-yellow-600 font-semibold text-lg">
                  👍 Not bad! Getting warmer!
                </p>
              ) : (
                <p className="text-red-600 font-semibold text-lg">
                  📍 Too far! Better luck next time!
                </p>
              )}
            </div>
              <div className="pt-4">
                <button
                  onClick = {() => {
                    console.log("Play Again clicked");
                    setShowResults(false);
                    VISITED_LOCATIONS.current.add(CURRENT_LOCATION.current)
                    const newpos = chooseLoc()
                    CURRENT_LOCATION.current = newpos
                    panoRef.current?.setPosition(newpos);
                    hasGuessedRef.current = false;
                    setShowMap(false);
                    lineRef.current?.setVisible(false);
                    if (markerRef.current && actualLocationMarkerRef.current && mapInstanceRef.current) {
                      markerRef.current.map = null;
                      actualLocationMarkerRef.current.map = null;
                      mapInstanceRef.current.setCenter(CAMPUS_CENTER);
                    }
                  }}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Play Again
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}