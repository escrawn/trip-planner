
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface GoogleMapProps {
  startLocation: string;
  endLocation: string;
  hotels: any[];
  selectedHotels: any;
  routeType: string;
  onHotelSelect?: (waypointId: string, hotelId: string) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  startLocation, 
  endLocation, 
  hotels, 
  selectedHotels, 
  routeType,
  onHotelSelect 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyAeYDBR0Kwf14a-2DkucJc1I2lUffW5CKE';

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 7,
        center: { lat: 46.2276, lng: 2.2137 }, // Center of France
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const directionsServiceInstance = new window.google.maps.DirectionsService();
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: routeType === 'fastest' ? '#2563eb' : '#16a34a',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });

      directionsRendererInstance.setMap(mapInstance);

      setMap(mapInstance);
      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);
    };

    loadGoogleMaps();
  }, [routeType]);

  useEffect(() => {
    if (map && directionsService && directionsRenderer && startLocation && endLocation) {
      calculateAndDisplayRoute();
    }
  }, [map, directionsService, directionsRenderer, startLocation, endLocation, routeType]);

  const calculateAndDisplayRoute = () => {
    if (!directionsService || !directionsRenderer) return;

    // Create waypoints for stops
    const waypoints = hotels.slice(0, -1).map(() => ({
      location: getRandomLocationBetweenCities(),
      stopover: true,
    }));

    const request = {
      origin: startLocation,
      destination: endLocation,
      waypoints: waypoints,
      optimizeWaypoints: routeType === 'fastest',
      travelMode: window.google.maps.TravelMode.DRIVING,
      avoidTolls: routeType === 'cheapest',
      avoidHighways: routeType === 'cheapest',
    };

    directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
        addHotelMarkers(result);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  };

  const getRandomLocationBetweenCities = () => {
    // Generate random points between Paris and Lyon for demonstration
    const parisLat = 48.8566;
    const parisLng = 2.3522;
    const lyonLat = 45.7640;
    const lyonLng = 4.8357;
    
    const randomLat = parisLat + (lyonLat - parisLat) * Math.random();
    const randomLng = parisLng + (lyonLng - parisLng) * Math.random();
    
    return { lat: randomLat, lng: randomLng };
  };

  const addHotelMarkers = (directionsResult: any) => {
    if (!map) return;

    const route = directionsResult.routes[0];
    const legs = route.legs;
    
    // Add start marker
    new window.google.maps.Marker({
      position: legs[0].start_location,
      map: map,
      title: startLocation,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#10b981" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">A</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32),
      },
    });

    // Add end marker
    new window.google.maps.Marker({
      position: legs[legs.length - 1].end_location,
      map: map,
      title: endLocation,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">B</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32),
      },
    });

    // Get route path points for positioning hotels near the route
    const path = route.overview_path;
    
    // Add hotel markers along the route
    hotels.forEach((stop, stopIndex) => {
      // Position stops along the route path
      const pathIndex = Math.floor((path.length / (hotels.length + 1)) * (stopIndex + 1));
      const stopPosition = path[pathIndex] || getRandomLocationBetweenCities();
      
      // Add city marker
      new window.google.maps.Marker({
        position: stopPosition,
        map: map,
        title: stop.waypoint.city,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="${routeType === 'fastest' ? '#2563eb' : '#16a34a'}" stroke="white" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">${stopIndex + 1}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
        },
      });

      // Show selected hotel and up to 3 additional nearby hotels
      const selectedHotel = stop.hotels.find((hotel: any) => hotel.id === selectedHotels?.[stop.waypoint?.id]);
      const otherHotels = stop.hotels.filter((hotel: any) => hotel.id !== selectedHotels?.[stop.waypoint?.id]).slice(0, 3);
      const displayedHotels = selectedHotel ? [selectedHotel, ...otherHotels] : stop.hotels.slice(0, 4);

      // Add hotel markers near the route
      displayedHotels.forEach((hotel: any, hotelIndex: number) => {
        // Position hotels closer to the route (smaller radius)
        const angle = (hotelIndex * 90) - 45;
        const radius = 0.003; // Much smaller radius to keep hotels near route
        const hotelLat = stopPosition.lat() + Math.cos(angle * Math.PI / 180) * radius;
        const hotelLng = stopPosition.lng() + Math.sin(angle * Math.PI / 180) * radius;
        
        const isSelected = hotel.id === selectedHotels?.[stop.waypoint?.id];
        
        const marker = new window.google.maps.Marker({
          position: { lat: hotelLat, lng: hotelLng },
          map: map,
          title: `${hotel.name} - €${hotel.price}/night`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="8" width="20" height="12" fill="${isSelected ? '#fbbf24' : '#6366f1'}" stroke="white" stroke-width="1" rx="2"/>
                <rect x="4" y="6" width="16" height="2" fill="${isSelected ? '#f59e0b' : '#4f46e5'}" rx="1"/>
                <circle cx="6" cy="11" r="1" fill="white"/>
                <circle cx="10" cy="11" r="1" fill="white"/>
                <circle cx="14" cy="11" r="1" fill="white"/>
                <circle cx="18" cy="11" r="1" fill="white"/>
                <circle cx="6" cy="15" r="1" fill="white"/>
                <circle cx="10" cy="15" r="1" fill="white"/>
                <circle cx="14" cy="15" r="1" fill="white"/>
                <circle cx="18" cy="15" r="1" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24),
          },
        });

        // Add info window with hotel image
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2 w-48" style="max-width: 200px;">
              <img src="${hotel.image}" alt="${hotel.name}" class="w-full h-16 object-cover rounded mb-2" style="height: 64px;" />
              <h3 class="font-semibold text-sm text-gray-900 mb-1" style="font-size: 13px; line-height: 1.2;">${hotel.name}</h3>
              <p class="text-blue-600 font-bold mb-1" style="font-size: 14px;">€${hotel.price}/night</p>
              <div class="flex items-center mb-1">
                <span class="text-yellow-400" style="font-size: 12px;">★</span>
                <span class="text-xs text-gray-600 ml-1" style="font-size: 11px;">${hotel.rating} (${hotel.reviews})</span>
              </div>
              <p class="text-xs text-gray-500 mb-2" style="font-size: 10px;">${hotel.location}</p>
              <div class="flex flex-wrap gap-1">
                ${hotel.amenities.slice(0, 2).map((amenity: string) => 
                  `<span class="bg-gray-100 text-gray-700 px-1 py-0.5 rounded" style="font-size: 9px; padding: 2px 4px;">${amenity}</span>`
                ).join('')}
              </div>
            </div>
          `,
          maxWidth: 220,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          // Handle hotel selection when marker is clicked
          if (onHotelSelect) {
            onHotelSelect(stop.waypoint.id, hotel.id);
          }
        });
      });
    });
  };

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden"
      style={{ minHeight: '300px' }}
    />
  );
};

export default GoogleMap;
