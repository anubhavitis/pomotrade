import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-white/2 backdrop-blur-sm mt-auto py-2">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-600 text-center font-medium">
                        © 2025, pomotrade.com
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
