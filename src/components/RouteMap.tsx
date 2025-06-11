
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, DollarSign, Zap, MapPin } from 'lucide-react';
import GoogleMap from './GoogleMap';

const RouteMap = ({ startLocation, endLocation, route, hotels, numberOfStops, selectedRouteType, onRouteTypeChange, selectedHotels, onHotelSelect }) => {
    const [expandedMap, setExpandedMap] = useState('best');

    const toggleMap = (mapType) => {
        setExpandedMap(expandedMap === mapType ? null : mapType);
        onRouteTypeChange(mapType);
    };

    const MapVisualization = ({ routeType }) => (
        <div className="relative">
            <GoogleMap
                startLocation={startLocation}
                endLocation={endLocation}
                hotels={hotels}
                selectedHotels={selectedHotels}
                routeType={routeType}
                onHotelSelect={onHotelSelect}
            />
            
            {/* Route Info Overlay */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white rounded-lg shadow-md px-2 sm:px-4 py-2 sm:py-3">
                <div className="text-xs sm:text-sm">
                    <div className="font-semibold text-gray-900">
                        {routeType === 'fastest' ? route.fastest?.distance || route.distance : 
                         routeType === 'cheapest' ? `${Math.round(parseFloat((route.fastest?.distance || route.distance || '462 km').replace(/[^\d.]/g, '')) * 1.15)} km` :
                         route.best?.distance || route.distance}
                    </div>
                    <div className="text-gray-600">
                        {routeType === 'fastest' ? route.fastest?.duration || route.duration : 
                         routeType === 'cheapest' ? (() => {
                             const baseDuration = parseFloat((route.fastest?.duration || route.duration || '4h 30m').replace(/[^\d.]/g, ''));
                             const totalMinutes = Math.round(baseDuration * 60 * 1.15); // 15% longer
                             const hours = Math.floor(totalMinutes / 60);
                             const minutes = totalMinutes % 60;
                             return `${hours}h ${minutes}m`;
                         })() :
                         route.best?.duration || `${Math.round(parseFloat((route.fastest?.duration || route.duration || '4h 30m').replace(/[^\d.]/g, '')) * 1.1)}h`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {routeType === 'fastest' ? 'Fastest' : 
                         routeType === 'cheapest' ? 'Cheapest' : 'Best Route'} • {numberOfStops} stops
                    </div>
                </div>
            </div>

            {/* Hotel Legend */}
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white rounded-lg shadow-md px-2 sm:px-3 py-1 sm:py-2">
                <div className="flex items-center space-x-2 text-xs">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-gray-600">Selected</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-600">Available</span>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!route) return null;

    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Best Route */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                    onClick={() => toggleMap('best')}
                    className={`w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 ${
                        selectedRouteType === 'best' ? 'bg-purple-50' : ''
                    }`}
                >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Best Route</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Optimal balance • Time & cost efficient</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="text-right">
                            <div className="text-sm sm:text-lg font-semibold text-purple-600">
                                {route.best?.duration || `${Math.round(parseFloat((route.fastest?.duration || route.duration || '4h 30m').replace(/[^\d.]/g, '')) * 1.1)}h`}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">{route.best?.distance || route.fastest?.distance || route.distance}</div>
                        </div>
                        {expandedMap === 'best' ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        )}
                    </div>
                </button>
                
                {expandedMap === 'best' && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <MapVisualization routeType="best" />
                    </div>
                )}
            </div>

            {/* Fastest Route */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                    onClick={() => toggleMap('fastest')}
                    className={`w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 ${
                        selectedRouteType === 'fastest' ? 'bg-blue-50' : ''
                    }`}
                >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Fastest Route</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Shortest travel time • {route.fastest?.duration || route.duration}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="text-right">
                            <div className="text-sm sm:text-lg font-semibold text-blue-600">{route.fastest?.duration || route.duration}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{route.fastest?.distance || route.distance}</div>
                        </div>
                        {expandedMap === 'fastest' ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        )}
                    </div>
                </button>
                
                {expandedMap === 'fastest' && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <MapVisualization routeType="fastest" />
                    </div>
                )}
            </div>

            {/* Cheapest Route */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                    onClick={() => toggleMap('cheapest')}
                    className={`w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 ${
                        selectedRouteType === 'cheapest' ? 'bg-green-50' : ''
                    }`}
                >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Cheapest Route</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Best value • Lower fuel costs</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="text-right">
                            <div className="text-sm sm:text-lg font-semibold text-green-600">
                                {Math.round(parseFloat((route.fastest?.duration || route.duration || '4h 30m').replace(/[^\d.]/g, '')) * 1.3)}h
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                                {Math.round(parseFloat((route.fastest?.distance || route.distance || '462 km').replace(/[^\d.]/g, '')) * 1.15)} km
                            </div>
                        </div>
                        {expandedMap === 'cheapest' ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        )}
                    </div>
                </button>
                
                {expandedMap === 'cheapest' && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <MapVisualization routeType="cheapest" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteMap;
