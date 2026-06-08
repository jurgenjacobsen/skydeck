import { useState, useEffect } from 'react';
import { Flame, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
    qStreak: number;
}

const Dashboard: React.FC<DashboardProps> = ({ qStreak }) => {
    const navigate = useNavigate();

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

            {/* Main Dashboard Panel Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score Progress Chart & Syllabus Progress */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-theme-card border border-theme-border rounded p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-theme-text-dark text-sm">
                                    Weekly Performance Metrics
                                </h3>
                                <p className="text-xs text-theme-text-muted mt-1">
                                    Averages calculated across active simulation attempts
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-mono">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded bg-theme-brand"></span>
                                    <span className="text-theme-text-main font-sans">
                                        Syllabus Score
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded bg-slate-200"></span>
                                    <span className="text-theme-text-muted font-sans">
                                        Passing Limit (75%)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* SVG Progress Graph */}
                        <div className="w-full h-52 relative border-b border-theme-border">
                            {/* Grid lines */}
                            <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between pointer-events-none text-xs font-mono text-theme-text-muted">
                                <div className="w-full border-t border-theme-border pt-1">100%</div>
                                <div className="w-full border-t border-theme-error pt-1 border-dashed opacity-50 font-semibold">
                                    75% (Pass Threshold)
                                </div>
                                <div className="w-full border-t border-theme-border pt-1">50%</div>
                                <div className="w-full border-t border-theme-border pt-1">25%</div>
                                <div>0%</div>
                            </div>

                            {/* Sparkline Graph */}
                            <svg
                                className="w-full h-full absolute inset-0 pt-4"
                                preserveAspectRatio="none"
                                viewBox="0 0 100 100"
                            >
                                <path
                                    d="M 5 45 L 20 38 L 35 30 L 50 35 L 65 24 L 80 28 L 95 20"
                                    fill="none"
                                    stroke="#6349ea"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                                <circle cx="5" cy="45" r="2.5" fill="#6349ea" />
                                <circle cx="20" cy="38" r="2.5" fill="#6349ea" />
                                <circle cx="35" cy="30" r="2.5" fill="#6349ea" />
                                <circle cx="50" cy="35" r="2.5" fill="#6349ea" />
                                <circle cx="65" cy="24" r="2.5" fill="#6349ea" />
                                <circle cx="80" cy="28" r="2.5" fill="#6349ea" />
                                <circle cx="95" cy="20" r="2.5" fill="#6349ea" />
                            </svg>
                        </div>
                        {/* X Axis labels */}
                        <div className="flex justify-between items-center mt-3 text-xs font-mono text-theme-text-muted px-6">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>
                    </div>

                    {/* Active Spaced Repetition Alert Box */}
                    <div className="bg-theme-card border border-theme-border rounded p-6 shadow-sm">
                        <div className="flex items-center gap-3 text-amber-700 mb-4">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <h3 className="font-bold text-theme-text-dark text-sm">
                                Cognitive Retention Alert
                            </h3>
                        </div>
                        <p className="text-xs text-theme-text-main leading-relaxed mb-4">
                            Our spaced repetition algorithm has identified drops in visual cockpit
                            flow retention and meteorological formula calculations. We recommend
                            reviewing the following items today:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-theme-extra-light border border-theme-border p-4 rounded flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-theme-text-dark">
                                        Wind Correction Angles
                                    </div>
                                    <div className="text-xs text-theme-text-muted font-mono mt-0.5">
                                        Subject 061 General Nav
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/qbank')}
                                    className="text-xs text-theme-brand font-semibold hover:text-theme-brand/85 transition-colors"
                                >
                                    Review Now →
                                </button>
                            </div>

                            <div className="bg-theme-extra-light border border-theme-border p-4 rounded flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-theme-text-dark">
                                        APU SOP Startup Flow
                                    </div>
                                    <div className="text-xs text-theme-text-muted font-mono mt-0.5">
                                        Procedure flows SOP
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/flows')}
                                    className="text-xs text-theme-brand font-semibold hover:text-theme-brand/85 transition-colors"
                                >
                                    Train Flow →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Mini Stats and Quick launch */}
                <div className="space-y-8">
                    {/* Syllabus breakdown progress */}
                    <div className="bg-theme-card border border-theme-border rounded p-6 shadow-sm">
                        <h3 className="font-bold text-theme-text-dark text-sm mb-4">
                            Syllabus Mapping (ECQB)
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-theme-text-main font-medium">
                                        022 Instrumentation
                                    </span>
                                    <span className="text-theme-text-muted font-mono font-semibold">
                                        92%
                                    </span>
                                </div>
                                <div className="w-full bg-theme-bg h-1 rounded overflow-hidden">
                                    <div
                                        className="bg-theme-brand h-full"
                                        style={{ width: '92%' }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-theme-text-main font-medium">
                                        033 Flight Planning
                                    </span>
                                    <span className="text-theme-text-muted font-mono font-semibold">
                                        68%
                                    </span>
                                </div>
                                <div className="w-full bg-theme-bg h-1 rounded overflow-hidden">
                                    <div
                                        className="bg-amber-500 h-full"
                                        style={{ width: '68%' }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-theme-text-main font-medium">
                                        061 General Navigation
                                    </span>
                                    <span className="text-theme-text-muted font-mono font-semibold">
                                        81%
                                    </span>
                                </div>
                                <div className="w-full bg-theme-bg h-1 rounded overflow-hidden">
                                    <div
                                        className="bg-theme-brand h-full"
                                        style={{ width: '81%' }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-theme-text-main font-medium">
                                        081 Principles of Flight
                                    </span>
                                    <span className="text-theme-text-muted font-mono font-semibold">
                                        54%
                                    </span>
                                </div>
                                <div className="w-full bg-theme-bg h-1 rounded overflow-hidden">
                                    <div
                                        className="bg-theme-error h-full"
                                        style={{ width: '54%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Simulator Checklist summary */}
                    <div className="bg-theme-card border border-theme-border rounded p-6 shadow-sm">
                        <h3 className="font-bold text-theme-text-dark text-sm mb-4">
                            Quick Flight Briefing
                        </h3>
                        <div className="space-y-3 text-xs">
                            <div className="p-3 bg-theme-extra-light border border-theme-border rounded flex items-center justify-between">
                                <div>
                                    <div className="text-theme-text-dark font-bold">
                                        EGLL → LFPG
                                    </div>
                                    <div className="text-xs text-theme-text-muted mt-0.5">
                                        Route Distance: 188 NM
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/briefing')}
                                    className="text-xs px-3 py-1 bg-theme-info-light text-theme-info border border-theme-border-soft rounded font-semibold hover:bg-theme-bg transition-colors"
                                >
                                    Brief
                                </button>
                            </div>

                            <div className="p-3 bg-theme-extra-light border border-theme-border rounded flex items-center justify-between">
                                <div>
                                    <div className="text-theme-text-dark font-bold">
                                        E6B Wind Solver
                                    </div>
                                    <div className="text-xs text-theme-text-muted mt-0.5">
                                        Adjust wind triangles
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/qbank')}
                                    className="text-xs px-3 py-1 bg-slate-200 text-slate-750 border border-theme-border-soft rounded font-semibold hover:bg-slate-300 transition-colors"
                                >
                                    Open
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
