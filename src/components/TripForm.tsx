import React from 'react';
import { MapPin } from 'lucide-react';

const TripForm = ({
                      startLocation,
                      endLocation,
                      numberOfStops,
                      setStartLocation,
                      setEndLocation,
                      setNumberOfStops,
                      calculateRoute,
                      isLoading,
                      route,
                  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Plan Your Journey</h2>
        <div className="space-y-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-blue-600" />
                    <input
                        type="text"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        placeholder="Enter starting location"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-yellow-500" />
                    <input
                        type="text"
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                        placeholder="Enter destination"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
        <div className="space-y-4 mb-6">
            <h3 className="font-medium text-gray-900">Trip Preferences</h3>
            <div>
                <label className="block text-sm text-gray-700 mb-2">Number of overnight stops</label>
                <select
                    value={numberOfStops}
                    onChange={(e) => setNumberOfStops(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value={1}>1 stop</option>
                    <option value={2}>2 stops</option>
                    <option value={3}>3 stops</option>
                    <option value={4}>4 stops</option>
                </select>
            </div>
        </div>
        <button
            onClick={calculateRoute}
            disabled={!startLocation || !endLocation || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Planning your trip...</span>
                </>
            ) : (
                <>
                    <span>Plan My Trip</span>
                </>
            )}
        </button>
        {route && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Trip Summary</h3>
                <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span>Total Distance:</span>
                        <span className="font-medium">{route.distance}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Driving Time:</span>
                        <span className="font-medium">{route.duration}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Overnight Stops:</span>
                        <span className="font-medium">{numberOfStops}</span>
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default TripForm;