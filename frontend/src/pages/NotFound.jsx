import React from 'react';
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
            <Link to="/" className="btn bg-black hover:bg-red-400 text-white px-4 py-2">
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound;