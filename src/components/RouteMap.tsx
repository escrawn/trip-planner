import React from 'react';

const RouteMap = ({ startLocation, endLocation, route, hotels, numberOfStops }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Route</h3>
        <div className="rounded-lg overflow-hidden h-96 bg-blue-50 relative">
            {/* Mock Map Background */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-blue-100"></div>

            {/* Mock Route Line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Roads */}
                <path d="M50 100 Q100 80 150 100 T250 120 Q300 130 350 140" stroke="#e5e7eb"
                      strokeWidth="4" fill="none"/>
                <path d="M80 200 Q120 180 160 200 T260 220 Q310 230 360 240"
                      stroke="#e5e7eb" strokeWidth="3" fill="none"/>
                <path d="M30 150 Q80 140 130 150 T230 170 Q280 180 330 190" stroke="#e5e7eb"
                      strokeWidth="3" fill="none"/>

                {/* Main Route */}
                <path
                    d="M60 120 Q110 100 160 120 T260 140 Q310 150 340 160"
                    stroke="#2563eb"
                    strokeWidth="4"
                    fill="none"
                    filter="url(#glow)"
                    className="animate-pulse"
                />

                {/* Start Pin */}
                <circle cx="60" cy="120" r="8" fill="#10b981" stroke="white"
                        strokeWidth="2"/>
                <text x="60" y="105" textAnchor="middle" className="text-xs font-semibold"
                      fill="#059669">A
                </text>

                {/* Hotel Stop Pins */}
                {Array.isArray(hotels) && hotels.map((stop, index) => {
                    const x = 60 + ((340 - 60) / (numberOfStops + 1)) * (index + 1);
                    const y = 120 + Math.sin(x * 0.02) * 20;
                    return (
                        <g key={stop.waypoint?.id}>
                            <circle cx={x} cy={y} r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
                            <text x={x} y={y - 12} textAnchor="middle" className="text-xs font-semibold" fill="#1e40af">
                                {index + 1}
                            </text>
                        </g>
                    );
                })}

                {/* End Pin */}
                <circle cx="340" cy="160" r="8" fill="#ef4444" stroke="white"
                        strokeWidth="2"/>
                <text x="340" y="145" textAnchor="middle" className="text-xs font-semibold"
                      fill="#dc2626">B
                </text>
            </svg>

            {/* Location Labels */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span
                        className="text-sm font-medium text-gray-700">{startLocation}</span>
                </div>
            </div>

            <div
                className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md px-3 py-2">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{endLocation}</span>
                </div>
            </div>

            {/* Route Info Overlay */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md px-4 py-3">
                <div className="text-sm">
                    <div className="font-semibold text-gray-900">{route.distance}</div>
                    <div className="text-gray-600">{route.duration}</div>
                    <div className="text-xs text-gray-500 mt-1">{numberOfStops} stops</div>
                </div>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md">
                <div className="flex flex-col">
                    <button className="p-2 hover:bg-gray-50 text-gray-600 border-b">
                        <span className="text-lg font-bold">+</span>
                    </button>
                    <button className="p-2 hover:bg-gray-50 text-gray-600">
                        <span className="text-lg font-bold">−</span>
                    </button>
                </div>
            </div>

            {/* Google Maps Style Attribution */}
            <div
                className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
                Mock Route View
            </div>
        </div>
    </div>
);

export default RouteMap;