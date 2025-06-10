import React from 'react';

const TripTimeline = ({ hotels, tripTimes, startLocation, endLocation, formatTime }) => (
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
                <div key={stop.waypoint.id} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
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
);

export default TripTimeline;