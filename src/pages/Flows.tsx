import React from 'react';

const Flows: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                        Procedure Flows Trainer
                    </h1>
                    <p className="text-theme-text-main text-xs mt-1">
                        Practice aircraft systems startup and memory flows in high fidelity.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Flows;
