import React, {useState, useEffect, useRef} from 'react';
import {MapPin, Clock, Car, Hotel, Calendar, Users, Star, Wifi, Coffee} from 'lucide-react';
import Header from "./components/Header";
import TripForm from "./components/TripForm";
import RouteMap from "./components/RouteMap";

const TravelPlanner = () => {
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [numberOfStops, setNumberOfStops] = useState(2);
    const [route, setRoute] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tripTimes, setTripTimes] = useState({});
    const mapRef = useRef(null);

    // Mock hotel data with realistic details
    const mockHotels = [
        {
            id: 1,
            name: "Grand Plaza Hotel & Suites",
            rating: 4.3,
            price: 129,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Pool", "Gym", "Parking"],
            location: "Downtown District",
            reviews: 1247
        },
        {
            id: 2,
            name: "Sunset Inn Express",
            rating: 4.1,
            price: 89,
            image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Breakfast", "Parking"],
            location: "Highway Junction",
            reviews: 892
        },
        {
            id: 3,
            name: "Mountain View Resort",
            rating: 4.6,
            price: 189,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Spa", "Restaurant", "Pool"],
            location: "Scenic Route",
            reviews: 2103
        },
        {
            id: 4,
            name: "Business Traveler Lodge",
            rating: 4.0,
            price: 99,
            image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Business Center", "Parking"],
            location: "Commercial District",
            reviews: 756
        }
    ];

    // Mock route calculation
    const calculateRoute = async () => {
        if (!startLocation || !endLocation) return;

        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock route data
        const mockRoute = {
            distance: "1,247 km",
            duration: "12h 30m",
            waypoints: generateWaypoints(),
            totalTime: 750 // minutes
        };

        setRoute(mockRoute);
        generateHotelRecommendations(mockRoute);
        initializeTripTimes(mockRoute);
        setIsLoading(false);
    };

    const generateWaypoints = () => {
        const waypoints = [];
        for (let i = 1; i <= numberOfStops; i++) {
            waypoints.push({
                id: i,
                name: `Stop ${i}`,
                city: `City ${i}`,
                distance: `${Math.round((1247 / (numberOfStops + 1)) * i)} km`,
                estimatedTime: `${Math.round((12.5 / (numberOfStops + 1)) * i)}h ${Math.round(((12.5 / (numberOfStops + 1)) * i % 1) * 60)}m`
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

    const updateTripTime = (stopId, newTime) => {
        setTripTimes(prev => ({
            ...prev,
            [stopId]: newTimef
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

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel - Trip Planning Form */}
                    <div className="lg:col-span-1">
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

                    {/* Right Panel - Results */}
                    <div className="lg:col-span-2">
                        {!route ? (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Plan Your
                                    Journey?</h3>
                                <p className="text-gray-600">Enter your start and end locations to begin planning your
                                    perfect road trip with hotel recommendations along the way.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Route Map */}
                                <RouteMap   startLocation={startLocation}
                                            endLocation={endLocation}
                                            numberOfStops={numberOfStops}
                                            isLoading={isLoading}
                                            route={route} />
                                {/* Hotel Recommendations */}
                                <div className="space-y-6">
                                    {hotels.map((stop, index) => (
                                        <div key={stop.waypoint.id} className="bg-white rounded-xl shadow-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{stop.waypoint.city}</h3>
                                                        <p className="text-sm text-gray-600">{stop.waypoint.distance} from
                                                            start</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <Clock className="w-4 h-4 text-gray-400"/>
                                                        <input
                                                            type="time"
                                                            value={tripTimes[stop.waypoint.id] || ''}
                                                            onChange={(e) => updateTripTime(stop.waypoint.id, e.target.value)}
                                                            className="text-sm border border-gray-300 rounded px-2 py-1"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500">Arrival time</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {stop.hotels.map((hotel) => (
                                                    <div key={hotel.id}
                                                         className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                                                        <div className="aspect-w-16 aspect-h-9">
                                                            <img
                                                                src={hotel.image}
                                                                alt={hotel.name}
                                                                className="w-full h-32 object-cover"
                                                            />
                                                        </div>
                                                        <div className="p-4">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h4 className="font-semibold text-gray-900 text-sm">{hotel.name}</h4>
                                                                <div className="flex items-center space-x-1">
                                                                    <Star
                                                                        className="w-4 h-4 text-yellow-400 fill-current"/>
                                                                    <span
                                                                        className="text-sm text-gray-600">{hotel.rating}</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-gray-600 mb-2">{hotel.location}</p>
                                                            <div className="flex flex-wrap gap-1 mb-3">
                                                                {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                                                                    <span key={idx}
                                                                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {amenity}
                                  </span>
                                                                ))}
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <span
                                                                        className="text-lg font-bold text-gray-900">${hotel.price}</span>
                                                                    <span
                                                                        className="text-sm text-gray-600">/night</span>
                                                                </div>
                                                                <button
                                                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-3 py-1 rounded text-sm transition-colors duration-200">
                                                                    Book Now
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">{hotel.reviews} reviews</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Trip Timeline */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Timeline</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">Start: {startLocation}</p>
                                                <p className="text-sm text-gray-600">Departure: {formatTime(tripTimes.start || '09:00')}</p>
                                            </div>
                                        </div>

                                        {hotels.map((stop, index) => (
                                            <div key={stop.waypoint.id}
                                                 className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">Stop {index + 1}: {stop.waypoint.city}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Arrival: {formatTime(tripTimes[stop.waypoint.id] || '12:00')} •
                                                        Distance: {stop.waypoint.distance}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">End: {endLocation}</p>
                                                <p className="text-sm text-gray-600">Final destination</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelPlanner;