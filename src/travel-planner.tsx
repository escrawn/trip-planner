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
    const [showBookingModal, setShowBookingModal] = useState(false);

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
        },
        {
            id: 5,
            name: "Best Western Plus Hotel de la Paix",
            rating: 4.3,
            price: 115,
            image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Concierge", "Room Service", "Laundry"],
            location: "Town Center",
            reviews: 892,
            isFastest: false,
            isCheapest: false
        },
        {
            id: 6,
            name: "Kyriad Prestige Auxerre",
            rating: 3.9,
            price: 78,
            image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Restaurant", "Meeting Rooms", "Parking"],
            location: "Business District",
            reviews: 556,
            isFastest: false,
            isCheapest: true
        },
        {
            id: 7,
            name: "Novotel Chalon-sur-Saône",
            rating: 4.4,
            price: 132,
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Pool", "Restaurant", "Bar", "Fitness"],
            location: "Riverside",
            reviews: 1234,
            isFastest: true,
            isCheapest: false
        },
        {
            id: 8,
            name: "Hotel Premiere Classe Sens",
            rating: 3.2,
            price: 55,
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop",
            amenities: ["Free WiFi", "Breakfast", "24h Reception"],
            location: "Highway Access",
            reviews: 423,
            isFastest: false,
            isCheapest: true
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
        const hotelRecommendations = generateHotelRecommendations(mockRoute);
        initializeTripTimes(mockRoute);
        initializeSelectedHotels(hotelRecommendations);
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
        const recommendations = route.waypoints.map(waypoint => {
            // Randomly select 4-5 hotels from the pool for each waypoint
            const shuffled = [...mockHotels].sort(() => 0.5 - Math.random());
            const selectedHotels = shuffled.slice(0, Math.floor(Math.random() * 2) + 4); // 4-5 hotels
            
            return {
                waypoint,
                hotels: selectedHotels.map(hotel => ({
                    ...hotel,
                    id: `${waypoint.id}-${hotel.id}`,
                    price: hotel.price + Math.round(Math.random() * 40 - 20)
                }))
            };
        });
        setHotels(recommendations);
        return recommendations;
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

    const initializeSelectedHotels = (hotelRecommendations) => {
        const initialSelections = {};
        hotelRecommendations.forEach(stop => {
            // Select fastest hotel by default
            const fastestHotel = stop.hotels.find(h => h.isFastest) || stop.hotels[0];
            initialSelections[stop.waypoint.id] = fastestHotel.id;
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

    const getSelectedHotelsDetails = () => {
        const selectedDetails = [];
        hotels.forEach(stop => {
            const selectedHotelId = selectedHotels[stop.waypoint.id];
            if (selectedHotelId) {
                const hotel = stop.hotels.find(h => h.id === selectedHotelId);
                if (hotel) {
                    selectedDetails.push({
                        ...hotel,
                        waypoint: stop.waypoint
                    });
                }
            }
        });
        return selectedDetails;
    };

    const calculateTotalPrice = () => {
        return getSelectedHotelsDetails().reduce((total, hotel) => total + hotel.price, 0);
    };

    const handleBookAll = () => {
        setShowBookingModal(true);
    };

    const handleConfirmBooking = () => {
        // Here you would integrate with a payment processor
        alert('Booking confirmed! Redirecting to payment...');
        setShowBookingModal(false);
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
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{stop.waypoint.city}</h3>
                                                <p className="text-xs sm:text-sm text-gray-600">{stop.waypoint.distance} from start</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 overflow-x-auto pb-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                                            <style jsx>{`
                                                div::-webkit-scrollbar {
                                                    display: none;
                                                }
                                            `}</style>
                                            {stop.hotels.map((hotel, hotelIndex) => {
                                                const isSelected = selectedHotels[stop.waypoint.id] === hotel.id;
                                                const isRecommended = (selectedRouteType === 'fastest' && hotel.isFastest) || 
                                                                     (selectedRouteType === 'cheapest' && hotel.isCheapest);
                                                const shouldShowRecommended = isRecommended && stop.hotels.findIndex(h => 
                                                    (selectedRouteType === 'fastest' && h.isFastest) || 
                                                    (selectedRouteType === 'cheapest' && h.isCheapest)
                                                ) === hotelIndex;

                                                return (
                                                    <div 
                                                        key={hotel.id}
                                                        onClick={() => handleHotelSelection(stop.waypoint.id, hotel.id)}
                                                        className={`border-2 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer h-80 flex flex-col relative flex-shrink-0 w-64 ${
                                                            isSelected 
                                                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                                                : shouldShowRecommended 
                                                                    ? 'border-yellow-400 ring-1 ring-yellow-200'
                                                                    : 'border-gray-200'
                                                        }`}
                                                    >
                                                        {shouldShowRecommended && (
                                                            <div className="bg-yellow-400 text-gray-900 text-xs font-semibold px-2 py-1 text-center absolute top-0 left-0 right-0 z-10" style={{borderRadius: '5px 5px 0 0'}}>
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

                            {/* Book All Button */}
                            {hotels.length > 0 && (
                                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Book?</h3>
                                        <p className="text-sm text-gray-600 mb-4">Book all selected hotels for your journey</p>
                                        <div className="mb-4">
                                            <span className="text-2xl font-bold text-blue-600">${calculateTotalPrice()}</span>
                                            <span className="text-sm text-gray-600 ml-1">total for {getSelectedHotelsDetails().length} hotels</span>
                                        </div>
                                        <button
                                            onClick={handleBookAll}
                                            className="text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
                                            style={{ backgroundColor: 'var(--color-blue-600)' }}
                                        >
                                            Book All Hotels
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Trip Timeline */}
                            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Trip Timeline</h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 bg-green-50 rounded-lg">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm sm:text-base">Start: {startLocation}</p>
                                        </div>
                                    </div>

                                    {hotels.map((stop, index) => {
                                        const segmentDistance = Math.round((462 / (numberOfStops + 1)) * (index + 1));
                                        const segmentTime = Math.round((4.5 / (numberOfStops + 1)) * (index + 1) * 60); // in minutes
                                        const hours = Math.floor(segmentTime / 60);
                                        const minutes = segmentTime % 60;
                                        
                                        return (
                                            <div key={stop.waypoint.id} className="flex items-center space-x-3 sm:space-x-4 p-3 bg-blue-50 rounded-lg">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 text-sm sm:text-base">Stop {index + 1}: {stop.waypoint.city}</p>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        {segmentDistance} km • {hours}h {minutes}m from start
                                                    </p>
                                                    {selectedHotels[stop.waypoint.id] && (
                                                        <p className="text-xs text-blue-600 mt-1">
                                                            Hotel: {stop.hotels.find(h => h.id === selectedHotels[stop.waypoint.id])?.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 bg-red-50 rounded-lg">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm sm:text-base">End: {endLocation}</p>
                                            <p className="text-xs sm:text-sm text-gray-600">462 km • 4h 30m total distance</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{backgroundColor: 'rgba(128, 128, 128, 0.5)'}}>
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Confirm Your Booking</h2>
                                <button 
                                    onClick={() => setShowBookingModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Selected Hotels:</h3>
                                {getSelectedHotelsDetails().map((hotel, index) => (
                                    <div key={hotel.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                        <img 
                                            src={hotel.image} 
                                            alt={hotel.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
                                            <p className="text-sm text-gray-600">{hotel.waypoint.city}</p>
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current"/>
                                                <span className="text-sm text-gray-600">{hotel.rating}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">${hotel.price}</p>
                                            <p className="text-sm text-gray-600">/night</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span>Total Amount:</span>
                                    <span className="text-blue-600">${calculateTotalPrice()}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">for {getSelectedHotelsDetails().length} hotels</p>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmBooking}
                                    className="flex-1 px-6 py-3 text-white rounded-lg transition-colors duration-200"
                                    style={{ backgroundColor: 'var(--color-blue-600)' }}
                                >
                                    Confirm & Pay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelPlanner;