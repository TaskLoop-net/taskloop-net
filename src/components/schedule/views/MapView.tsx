import React, { useEffect, useRef, useState } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface MapViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

const MapView = ({ currentDate, events }: MapViewProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", // Ensure you have this in your .env file
    libraries: ['places'], // Add libraries as needed
  });

  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate.getDate() === currentDate.getDate() && 
           eventDate.getMonth() === currentDate.getMonth() && 
           eventDate.getFullYear() === currentDate.getFullYear();
  });
  
  // Default map center (e.g., San Francisco) - Adjust as needed
  const mapCenter = {
    lat: 37.7749,
    lng: -122.4194
  };

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  useEffect(() => {
    if (loadError) {
      setMapError(`Map Error: ${loadError.message}`);
      console.error("Map loading error:", loadError);
    }
    if (isLoaded) {
      setMapLoaded(true);
      setMapError(null);
    }
  }, [isLoaded, loadError]);

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="flex">
        <div className="w-1/4 border-r p-4">
          <h3 className="font-medium mb-2">
            {todaysEvents.length} filtered items
          </h3>
          
          {todaysEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">All items are filtered</p>
          ) : (
            <div className="space-y-2">
              {todaysEvents.map((event, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded border text-sm">
                  <div className="font-medium">{event.title}</div>
                  {event.description && <div className="text-gray-600">{event.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="w-3/4 h-[600px] relative">
          {mapError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-red-500">
                <p>Could not load map</p>
                <p className="text-sm">{mapError}</p>
              </div>
            </div>
          ) : !isLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="mt-2">Loading map...</p>
              </div>
            </div>
          ) : (
            <>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={10} // Adjust zoom level as needed
              >
                {todaysEvents.map((event, idx) => (
                  event.latitude && event.longitude ? (
                    <Marker
                      key={event.id || idx}
                      position={{ lat: event.latitude, lng: event.longitude }}
                      // Add onClick or other props as needed
                      // title={event.title}
                    />
                  ) : null
                ))}
              </GoogleMap>
              
              <div className="absolute bottom-4 right-4 bg-white p-2 rounded-md shadow-md">
                <h4 className="text-sm font-medium mb-1">Visit Pins</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    <span>Assigned Visit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                    <span>Unassigned Visit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                    <span>Completed Visit</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
