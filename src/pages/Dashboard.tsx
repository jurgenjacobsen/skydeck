import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

interface DashboardProps {
    qStreak: number;
}

const Dashboard: React.FC<DashboardProps> = ({ qStreak }) => {

    const [aerodrome, setAerodrome] = useState(() => {
        return localStorage.getItem('homebase_aerodrome') || 'EGLL';
    });
    const [metar, setMetar] = useState('Loading...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const targetUrl = `https://aviationweather.gov/api/data/metar?ids=${aerodrome}&format=json`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

        fetch(proxyUrl)
            .then((res) => {
                if (!res.ok) throw new Error('HTTP error ' + res.status);
                return res.json();
            })
            .then((data) => {
                if (!active) return;
                const item = Array.isArray(data) ? data[0] : data;
                const cleaned = item?.rawOb ? item.rawOb.trim().split(aerodrome)[1] : '';
                setMetar(cleaned || `No METAR found for ${aerodrome}`);
                setLoading(false);
            })
            .catch((err) => {
                if (!active) return;
                console.error(err);
                setMetar(`Error fetching ${aerodrome} METAR`);
                setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [aerodrome]);

    const handleMetarClick = () => {
        const input = window.prompt('Enter ICAO Aerodrome code (e.g. EGLL, LFPG):', aerodrome);
        if (input !== null) {
            const code = input.trim().toUpperCase();
            if (code.length === 4) {
                setLoading(true);
                setAerodrome(code);
                localStorage.setItem('homebase_aerodrome', code);
            } else if (code.length > 0) {
                window.alert('Aerodrome code must be a 4-letter ICAO code.');
            }
        }
    };
    return (
        <div className="space-y-8">
            {/* Top Banner */}
            <div className="relative overflow-hidden rounded border border-theme-border bg-theme-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                        Welcome back, Captain.
                    </h1>
                    <p className="text-theme-text-main text-xs mt-1">
                        Your next scheduled virtual checkride is in 6 days. Let's review standard
                        SOP sequences.
                    </p>
                </div>
                <div
                    onClick={handleMetarClick}
                    className="bg-theme-extra-light border border-theme-border rounded px-4 py-2 flex items-center gap-3 hover:bg-theme-border/20 transition-colors"
                    title="Click to change homebase aerodrome"
                >
                    <div
                        className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-theme-success'}`}
                    ></div>
                    <div className="text-left font-mono">
                        <div className="text-xs text-theme-text-muted uppercase leading-none font-semibold">
                            HOMEBASE METAR ({aerodrome})
                        </div>
                        <div className="text-xs text-theme-text-dark font-bold mt-1">
                            {loading ? 'Fetching...' : metar}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-theme-card border border-theme-border rounded p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="text-theme-text-muted text-xs font-semibold uppercase tracking-wider">
                            Exam Prep Score
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-theme-success-light text-theme-success border border-theme-border-soft font-semibold">
                            Passing
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-theme-text-dark tracking-tight">
                            78%
                        </span>
                        <span className="text-xs text-theme-text-muted font-medium">
                            ECQB Target 75%
                        </span>
                    </div>
                    <div className="w-full bg-theme-bg h-1 rounded mt-4 overflow-hidden">
                        <div className="bg-theme-brand h-full" style={{ width: '78%' }}></div>
                    </div>
                </div>

                <div className="bg-theme-card border border-theme-border rounded p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="text-theme-text-muted text-xs font-semibold uppercase tracking-wider">
                            Flow Accuracy
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-theme-info-light text-theme-info border border-theme-border-soft font-semibold">
                            High
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-theme-text-dark tracking-tight">
                            92%
                        </span>
                        <span className="text-xs text-theme-text-muted font-medium">
                            SOP Target 95%
                        </span>
                    </div>
                    <div className="w-full bg-theme-bg h-1 rounded mt-4 overflow-hidden">
                        <div className="bg-theme-brand h-full" style={{ width: '92%' }}></div>
                    </div>
                </div>

                <div className="bg-theme-card border border-theme-border rounded p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="text-theme-text-muted text-xs font-semibold uppercase tracking-wider">
                            Active Streak
                        </span>
                        <span className="flex items-center gap-1 text-xs text-amber-700 font-semibold">
                            <Flame className="w-3 h-3 fill-amber-500 stroke-none" /> HOT
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-theme-text-dark tracking-tight">
                            {qStreak} Days
                        </span>
                        <span className="text-xs text-theme-text-muted font-medium">
                            Goal: 21 Days
                        </span>
                    </div>
                    <div className="w-full bg-theme-bg h-1 rounded mt-4 overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: '66%' }}></div>
                    </div>
                </div>

                <div className="bg-theme-card border border-theme-border rounded p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="text-theme-text-muted text-xs font-semibold uppercase tracking-wider">
                            Briefed Routes
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-theme-bg text-theme-text-main border border-theme-border-soft font-semibold">
                            100% Valid
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-theme-text-dark tracking-tight">
                            12
                        </span>
                        <span className="text-xs text-theme-text-muted font-medium">
                            Recent: EGLL-LFPG
                        </span>
                    </div>
                    <div className="w-full bg-theme-bg h-1 rounded mt-4 overflow-hidden">
                        <div className="bg-theme-success h-full" style={{ width: '100%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
