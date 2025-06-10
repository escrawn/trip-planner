import React from 'react';
import { Car } from 'lucide-react';

const Header = () => (
    <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Trip Planner</h1>
            </div>
        </div>
    </div>
);

export default Header;