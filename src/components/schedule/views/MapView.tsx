
import React, { useEffect, useRef, useState } from 'react';
import { CalendarEvent } from '@/types/calendar';

interface MapViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

const MapView = ({ currentDate, events }: MapViewProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate.getDate() === currentDate.getDate() && 
           eventDate.getMonth() === currentDate.getMonth() && 
           eventDate.getFullYear() === currentDate.getFullYear();
  });
  
  // This is a placeholder - in a real implementation, we'd use an actual map library like Mapbox or Google Maps
  useEffect(() => {
    // Mock loading the map
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
          ) : !mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="mt-2">Loading map...</p>
              </div>
            </div>
          ) : (
            <>
              <div ref={mapContainerRef} className="h-full w-full bg-gray-100">
                <div className="p-4 text-center">
                  <p>Map Placeholder</p>
                  <p className="text-sm text-gray-500">
                    This is where a real map would be displayed, showing event locations
                  </p>
                </div>
              </div>
              
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
