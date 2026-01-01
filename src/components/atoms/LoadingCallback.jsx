import React from 'react';

const LoadingCallback = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
        </div>
    );
};

export default LoadingCallback;
