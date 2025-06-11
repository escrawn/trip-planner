import React from 'react';
import { MapPin, Navigation, Users, Search } from 'lucide-react';

const TripForm = ({ 
    startLocation, 
    endLocation, 
    numberOfStops, 
    setStartLocation, 
    setEndLocation, 
    setNumberOfStops, 
    calculateRoute, 
    isLoading,
    route
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        calculateRoute();
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Plan Your Journey</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Enter your trip details to get started</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Start Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        From
                    </label>
                    <input
                        type="text"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        placeholder="Enter starting location"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                    />
                </div>

                {/* End Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        To
                    </label>
                    <input
                        type="text"
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                        placeholder="Enter destination"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                    />
                </div>

                {/* Number of Stops */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-2" />
                        Number of Stops
                    </label>
                    <select
                        value={numberOfStops}
                        onChange={(e) => setNumberOfStops(parseInt(e.target.value))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                        <option value={1}>1 stop</option>
                        <option value={2}>2 stops</option>
                        <option value={3}>3 stops</option>
                        <option value={4}>4 stops</option>
                        <option value={5}>5 stops</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !startLocation || !endLocation}
                    className="w-full text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50"
                    style={{ backgroundColor: isLoading || !startLocation || !endLocation ? '#9ca3af' : 'var(--color-blue-600)' }}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                            <span>Planning Route...</span>
                        </>
                    ) : (
                        <>
                            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Calculate Route</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default TripForm;