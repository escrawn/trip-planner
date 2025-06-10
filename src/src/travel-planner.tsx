import React, {useState, useEffect, useRef} from 'react';
import {MapPin, Clock, Car, Hotel, Calendar, Users, Star, Wifi, Coffee} from 'lucide-react';
import Header from "./components/Header";
import TripForm from "./components/TripForm";
import RouteMap from "./components/RouteMap";

const TravelPlanner = () => {
    const [startLocation, setStartLocation] = useState('Paris, France');
    const [endLocation, setEndLocation] = useState('Lyon, France');
    const [numberOfStops, setNumberOfStops] = useState(2);
    const [route, setRoute] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tripTimes, setTripTimes] = useState({});
    const [selectedRouteType, setSelectedRouteType] = useState('fastest');
    const [selectedHotels, setSelectedHotels] = useState({});
    const mapRef = useRef(null);
    const [bestRouteOpen, setBestRouteOpen] = useState(true);

    // Mock hotel data with French locations between Paris and Lyon
    const mockHotels = [
        {
            id: 1,
            name: "Château Hotel Fontainebleau",
            rating: 4.5,
            price: 145,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Pool", "Spa", "Valet Parking"],
            location: "Historic District",
            reviews: 1847,
            isFastest: true,
            isCheapest: false
        },
        {
            id: 2,
            name: "Ibis Budget Sens",
            rating: 3.8,
            price: 65,
            image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Breakfast", "Parking"],
            location: "Highway A6",
            reviews: 642,
            isFastest: false,
            isCheapest: true
        },
        {
            id: 3,
            name: "Relais du Morvan",
            rating: 4.2,
            price: 128,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Restaurant", "Garden", "Pet Friendly"],
            location: "Burgundy Countryside",
            reviews: 923,
            isFastest: false,
            isCheapest: false
        },
        {
            id: 4,
            name: "Hotel Mercure Mâcon",
            rating: 4.1,
            price: 89,
            image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Business Center", "Bar", "Fitness"],
            location: "City Center",
            reviews: 1156,
            isFastest: true,
            isCheapest: false
        }
    ];

    // Mock route calculation
    const calculateRoute = async () => {
        if (!startLocation || !endLocation) return;

        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock route data for Paris to Lyon
        const mockRoute = {
            distance: "462 km",
            duration: "4h 30m",
            waypoints: generateWaypoints(),
            totalTime: 270, // minutes
            cost: 50 // Mock cost for the route
        };

        // Mock "best" route data - for demonstration, slightly faster but more expensive
        const mockBestRoute = {
            distance: "460 km",
            duration: "4h 15m",
            waypoints: generateWaypoints(),
            totalTime: 255, // minutes, slightly faster
            cost: 75 // More expensive
        };


        setRoute({
            fastest: mockRoute,
            cheapest: mockRoute, //For now we use same mock data
            best: mockBestRoute
        });
        generateHotelRecommendations(mockRoute);
        initializeTripTimes(mockRoute);
        initializeSelectedHotels(mockRoute);
        setIsLoading(false);
    };

    const generateWaypoints = () => {
        const frenchCities = ['Fontainebleau', 'Sens', 'Auxerre', 'Chalon-sur-Saône', 'Mâcon'];
        const waypoints = [];
        const totalDistance = 462; // Approximate distance Paris to Lyon in km
        const totalTime = 4.5; // Approximate time in hours

        for (let i = 1; i <= numberOfStops; i++) {
            waypoints.push({
                id: i,
                name: `Stop ${i}`,
                city: frenchCities[i - 1] || `Stop ${i}`,
                distance: `${Math.round((totalDistance / (numberOfStops + 1)) * i)} km`,
                estimatedTime: `${Math.round((totalTime / (numberOfStops + 1)) * i)}h ${Math.round(((totalTime / (numberOfStops + 1)) * i % 1) * 60)}m`
            });
        }
        return waypoints;
    };

    const generateHotelRecommendations = (route) => {
        const recommendations = route.waypoints.map(waypoint => ({
            waypoint,
            hotels: mockHotels.slice(0, 3).map(hotel => ({
                ...hotel,
                id: `${waypoint.id}-${hotel.id}`,
                price: hotel.price + Math.round(Math.random() * 40 - 20)
            }))
        }));
        setHotels(recommendations);
    };

    const initializeTripTimes = (route) => {
        const times = {start: '09:00'};
        let currentTime = 9 * 60; // 9:00 AM in minutes

        route.waypoints.forEach(waypoint => {
            const segmentTime = (route.totalTime / (numberOfStops + 1));
            currentTime += segmentTime;
            const hours = Math.floor(currentTime / 60);
            const minutes = Math.round(currentTime % 60);
            times[waypoint.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        });

        setTripTimes(times);
    };

    const initializeSelectedHotels = (route) => {
        const initialSelections = {};
        route.waypoints.forEach(waypoint => {
            const waypointHotels = mockHotels.slice(0, 3).map(hotel => ({
                ...hotel,
                id: `${waypoint.id}-${hotel.id}`,
                price: hotel.price + Math.round(Math.random() * 40 - 20)
            }));

            // Select fastest hotel by default
            const fastestHotel = waypointHotels.find(h => h.isFastest) || waypointHotels[0];
            initialSelections[waypoint.id] = fastestHotel.id;
        });
        setSelectedHotels(initialSelections);
    };

    const updateTripTime = (stopId, newTime) => {
        setTripTimes(prev => ({
            ...prev,
            [stopId]: newTime
        }));
    };

    const handleRouteTypeChange = (routeType) => {
        setSelectedRouteType(routeType);
        setBestRouteOpen(false);

        // Auto-select recommended hotels based on route type
        if (hotels.length > 0) {
            const newSelections = {};
            hotels.forEach(stop => {
                const recommendedHotel = stop.hotels.find(hotel =>
                    routeType === 'fastest' ? hotel.isFastest : hotel.isCheapest
                ) || stop.hotels[0];
                newSelections[stop.waypoint.id] = recommendedHotel.id;
            });
            setSelectedHotels(newSelections);
        }
    };

    const handleHotelSelection = (waypointId, hotelId) => {
        setSelectedHotels(prev => ({
            ...prev,
            [waypointId]: hotelId
        }));
    };

    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header/>

            <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
                {/* Plan Your Journey - Moved to top */}
                <div className="mb-6">
                    <TripForm
                        startLocation={startLocation}
                        endLocation={endLocation}
                        numberOfStops={numberOfStops}
                        setStartLocation={setStartLocation}
                        setEndLocation={setEndLocation}
                        setNumberOfStops={setNumberOfStops}
                        calculateRoute={calculateRoute}
                        isLoading={isLoading}
                        route={route}
                    />
                </div>

                {/* Results */}
                <div>
                    {!route ? (
                        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
                            <Car className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4"/>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Ready to Plan Your Journey?</h3>
                            <p className="text-sm sm:text-base text-gray-600">Enter your start and end locations to begin planning your perfect road trip with hotel recommendations along the way.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Route Map */}
                            <RouteMap 
                                startLocation={startLocation}
                                endLocation={endLocation}
                                numberOfStops={numberOfStops}
                                isLoading={isLoading}
                                route={route}
                                hotels={hotels}
                                selectedRouteType={selectedRouteType}
                                onRouteTypeChange={handleRouteTypeChange}
                                selectedHotels={selectedHotels}
                                onHotelSelect={handleHotelSelection}
                                bestRouteOpen={bestRouteOpen}
                                setBestRouteOpen={setBestRouteOpen}
                            />

                            {/* Hotel Recommendations */}
                            <div className="space-y-4 sm:space-y-6">
                                {hotels.map((stop, index) => (
                                    <div key={stop.waypoint.id} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{stop.waypoint.city}</h3>
                                                    <p className="text-xs sm:text-sm text-gray-600">{stop.waypoint.distance} from start</p>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <Clock className="w-4 h-4 text-gray-400"/>
                                                    <input
                                                        type="time"
                                                        value={tripTimes[stop.waypoint.id] || ''}
                                                        onChange={(e) => updateTripTime(stop.waypoint.id, e.target.value)}
                                                        className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500">Arrival time</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                            {stop.hotels.map((hotel) => {
                                                const isSelected = selectedHotels[stop.waypoint.id] === hotel.id;
                                                const isRecommended = (selectedRouteType === 'fastest' && hotel.isFastest) || 
                                                                     (selectedRouteType === 'cheapest' && hotel.isCheapest);

                                                return (
                                                    <div 
                                                        key={hotel.id}
                                                        onClick={() => handleHotelSelection(stop.waypoint.id, hotel.id)}
                                                        className={`border-2 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer h-80 flex flex-col ${
                                                            isSelected 
                                                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                                                : isRecommended 
                                                                    ? 'border-yellow-400 ring-1 ring-yellow-200'
                                                                    : 'border-gray-200'
                                                        }`}
                                                    >
                                                        {isRecommended && (
                                                            <div className="bg-yellow-400 text-gray-900 text-xs font-semibold px-2 py-1 text-center">
                                                                {selectedRouteType === 'fastest' ? 'Fastest Route' : 
                                                                 selectedRouteType === 'cheapest' ? 'Cheapest Route' : 'Best Route'} Recommended
                                                            </div>
                                                        )}
                                                        <div className="h-32 flex-shrink-0">
                                                            <img
                                                                src={hotel.image}
                                                                alt={hotel.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="p-4 flex-1 flex flex-col justify-between min-h-0">
                                                            <div className="flex-1">
                                                                <div className="mb-2">
                                                                    <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{hotel.name}</h4>
                                                                    <div className="flex items-center space-x-1">
                                                                        <Star className="w-4 h-4 text-yellow-400 fill-current"/>
                                                                        <span className="text-sm text-gray-600">{hotel.rating}</span>
                                                                        <span className="text-xs text-gray-500">({hotel.reviews} reviews)</span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-gray-600 mb-2 line-clamp-1">{hotel.location}</p>
                                                                <div className="flex flex-wrap gap-1 mb-3">
                                                                    {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                                                                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                                            {amenity}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="mt-auto">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <span className="text-lg font-bold text-gray-900">${hotel.price}</span>
                                                                        <span className="text-sm text-gray-600">/night</span>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => handleHotelSelection(stop.waypoint.id, hotel.id)}
                                                                        className={`font-semibold px-3 py-1 rounded text-sm transition-colors duration-200 ${
                                                                            isSelected ? 'text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                                                        }`} 
                                                                        style={{ backgroundColor: isSelected ? 'var(--color-blue-600)' : '' }}
                                                                    >
                                                                        {isSelected ? 'Selected' : 'Select'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Trip Timeline */}
                            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Trip Timeline</h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 bg-green-50 rounded-lg">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm sm:text-base">Start: {startLocation}</p>
                                            <p className="text-xs sm:text-sm text-gray-600">Departure: {formatTime(tripTimes.start || '09:00')}</p>
                                        </div>
                                    </div>

                                    {hotels.map((stop, index) => (
                                        <div key={stop.waypoint.id} className="flex items-center space-x-3 sm:space-x-4 p-3 bg-blue-50 rounded-lg">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 text-sm sm:text-base">Stop {index + 1}: {stop.waypoint.city}</p>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Arrival: {formatTime(tripTimes[stop.waypoint.id] || '12:00')} •
                                                    Distance: {stop.waypoint.distance}
                                                </p>
                                                {selectedHotels[stop.waypoint.id] && (
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        Hotel: {stop.hotels.find(h => h.id === selectedHotels[stop.waypoint.id])?.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 bg-red-50 rounded-lg">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm sm:text-base">End: {endLocation}</p>
                                            <p className="text-xs sm:text-sm text-gray-600">Final destination</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TravelPlanner;