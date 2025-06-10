import React from 'react';

const HotelRecommendations = ({ hotels, tripTimes, updateTripTime }) => (
    <div className="space-y-6">
        {hotels.map((stop, index) => (
            <div key={stop.waypoint.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {index + 1}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{stop.waypoint.city}</h3>
                            <p className="text-sm text-gray-600">{stop.waypoint.distance} from start</p>
                        </div>
                    </div>
                </div>
                {/* Add hotel details here */}
            </div>
        ))}
    </div>
);

export default HotelRecommendations;