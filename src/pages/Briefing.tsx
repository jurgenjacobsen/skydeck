import React from 'react';

const Briefing: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                    Pre-Flight Planning & Briefing
                </h1>
                <p className="text-theme-text-main text-xs mt-1">
                    Ingest live METAR/TAF weather feeds and compile threat mitigations.
                </p>
            </div>
        </div>
    );
};

export default Briefing;
