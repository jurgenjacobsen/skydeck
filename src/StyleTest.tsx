import { useState } from 'react';
import Header from './components/gen/header';
import Sidebar from './components/gen/sidebar';

// Custom SVG Icons
const IconFlame = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconWarning = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
    </svg>
);

const IconCalculator = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
    </svg>
);

const IconCheck = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export default function StyleTest() {
    // Navigation Tabs
    const [activeTab, setActiveTab] = useState<
        'dashboard' | 'qbank' | 'wiki' | 'flows' | 'briefing'
    >('dashboard');

    // State for search bar
    const [searchQuery, setSearchQuery] = useState('');

    // ATPL Q-Bank State
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [qSubmitted, setQSubmitted] = useState(false);
    const [qStreak] = useState(14);
    const [isQuestionFlagged, setIsQuestionFlagged] = useState(false);

    // E6B Calculator State
    const [windSpeed, setWindSpeed] = useState(25);
    const [windDir, setWindDir] = useState(180);
    const [trueCourse, setTrueCourse] = useState(120);
    const [trueAirspeed, setTrueAirspeed] = useState(140);

    // E6B Calculations
    const windAngleRad = ((windDir - trueCourse) * Math.PI) / 180;
    const crosswind = Math.round(windSpeed * Math.sin(windAngleRad));
    const headwind = Math.round(windSpeed * Math.cos(windAngleRad));
    const wcaRad = Math.asin(crosswind / trueAirspeed) || 0;
    const wcaDeg = Math.round((wcaRad * 180) / Math.PI);
    const groundSpeed = Math.round(trueAirspeed * Math.cos(wcaRad) - headwind);

    // Legislation Wiki State
    const [wikiSearch, setWikiSearch] = useState('');
    const [wikiTab, setWikiTab] = useState<'airspace' | 'fuel' | 'medical'>('airspace');
    const [medicalAge, setMedicalAge] = useState<'under40' | '40to50' | 'over50'>('under40');
    const [medicalClass, setMedicalClass] = useState<'class1' | 'class2' | 'lapl'>('class1');

    // Procedure Flows Trainer State
    const [flowStep, setFlowStep] = useState(0);
    const [blindMode, setBlindMode] = useState(false);
    const [flowErrors, setFlowErrors] = useState(0);
    const [flowHistory, setFlowHistory] = useState<string[]>([]);
    const [panelState, setPanelState] = useState({
        battery: false,
        apuMaster: false,
        apuStart: false,
        apuGen: false,
        fuelPumps: false,
        engIgnition: 'norm',
        eng1Start: false,
        eng2Start: false,
    });

    const flowsSteps = [
        {
            text: 'Turn Battery ON to power the DC essential bus',
            check: (s: typeof panelState) => s.battery,
        },
        {
            text: 'Turn APU Master ON to initiate APU control unit check',
            check: (s: typeof panelState) => s.battery && s.apuMaster,
        },
        {
            text: 'Press APU Start Switch (momentary toggle)',
            check: (s: typeof panelState) => s.battery && s.apuMaster && s.apuStart,
        },
        {
            text: 'Turn APU Generator ON to assume AC electrical load',
            check: (s: typeof panelState) => s.battery && s.apuMaster && s.apuStart && s.apuGen,
        },
        {
            text: 'Turn ON Wing and Center Tank Fuel Pumps',
            check: (s: typeof panelState) => s.apuGen && s.fuelPumps,
        },
        {
            text: 'Rotate Engine Ignition selector to START',
            check: (s: typeof panelState) => s.fuelPumps && s.engIgnition === 'start1',
        },
        {
            text: 'Verify Engine 1 parameters stable and flow complete',
            check: (s: typeof panelState) =>
                s.fuelPumps && s.engIgnition === 'start1' && s.eng1Start,
        },
    ];

    const handleFlowAction = (action: string) => {
        let correct = false;
        const nextState = { ...panelState };

        if (flowStep === 0 && action === 'battery') {
            nextState.battery = true;
            correct = true;
        } else if (flowStep === 1 && action === 'apuMaster') {
            nextState.apuMaster = true;
            correct = true;
        } else if (flowStep === 2 && action === 'apuStart') {
            nextState.apuStart = true;
            correct = true;
        } else if (flowStep === 3 && action === 'apuGen') {
            nextState.apuGen = true;
            correct = true;
        } else if (flowStep === 4 && action === 'fuelPumps') {
            nextState.fuelPumps = true;
            correct = true;
        } else if (flowStep === 5 && action === 'ignitionStart') {
            nextState.engIgnition = 'start1';
            correct = true;
        } else if (flowStep === 6 && action === 'eng1Start') {
            nextState.eng1Start = true;
            correct = true;
        }

        setPanelState(nextState);

        if (correct) {
            setFlowHistory((prev) => [...prev, `[Success] Checked: ${flowsSteps[flowStep].text}`]);
            setFlowStep((prev) => prev + 1);
        } else {
            setFlowErrors((prev) => prev + 1);
            setFlowHistory((prev) => [
                ...prev,
                `[Warning] Warning: Flow sequence deviation on step ${flowStep + 1}`,
            ]);
        }
    };

    const resetFlow = () => {
        setFlowStep(0);
        setFlowErrors(0);
        setFlowHistory([]);
        setPanelState({
            battery: false,
            apuMaster: false,
            apuStart: false,
            apuGen: false,
            fuelPumps: false,
            engIgnition: 'norm',
            eng1Start: false,
            eng2Start: false,
        });
    };

    // Flight Planning Briefing State
    const [depIcao, setDepIcao] = useState('EGLL');
    const [arrIcao, setArrIcao] = useState('LFPG');
    const [metarParsed, setMetarParsed] = useState(false);
    const [notamFilter, setNotamFilter] = useState<'all' | 'rwy' | 'navaid' | 'tfr'>('all');
    const [temChecks, setTemChecks] = useState({
        shortRwy: false,
        convectiveWeather: false,
        complexTaxi: false,
        pilotFatigue: false,
    });

    const rawMetar = `${depIcao} 081620Z 24012KT 9999 FEW025 SCT040 18/12 Q1013 NOSIG`;

    const notams = [
        {
            id: 'A1024/26',
            type: 'rwy',
            text: `EGLL RUNWAY 27L CLOSED FOR MAINTENANCE DAILY FROM 2300 TO 0500 UTC`,
            level: 'HIGH',
        },
        {
            id: 'B4421/26',
            type: 'navaid',
            text: `LONDON VOR OON 113.60MHZ OUT OF SERVICE UNTIL FURTHER NOTICE`,
            level: 'MEDIUM',
        },
        {
            id: 'C0012/26',
            type: 'tfr',
            text: `TEMPORARY FLIGHT RESTRICTION (TFR) ACTIVE OVER WINDSOR CASTLE SFC-2500FT`,
            level: 'HIGH',
        },
        {
            id: 'A0853/26',
            type: 'rwy',
            text: `LFPG TWY ECHO1 CLOSE DUE TO AIRCRAFT RECOVERY EXERCISE`,
            level: 'LOW',
        },
    ];

    const filteredNotams = notams.filter((n) => notamFilter === 'all' || n.type === notamFilter);

    // Global search filtering logic
    const wikiRegulations = [
        {
            title: 'EASA Part-FCL.025',
            desc: 'Theoretical knowledge examinations rules & validity (18 months from first attempt)',
            cat: 'airspace',
        },
        {
            title: 'EASA Part-CAT.IDE.A.125',
            desc: 'Instruments and equipment required for VFR flights (ASI, Altimeter, Compass, Clock)',
            cat: 'airspace',
        },
        {
            title: 'EASA Part-FCL.740',
            desc: 'Revalidation of class and type ratings (12 hours / 12 landings / training flight)',
            cat: 'medical',
        },
        {
            title: 'ICAO Annex 2: Rule of the Air',
            desc: 'Right of way rules: overtaking aircraft must keep out of the way and alter course to the right',
            cat: 'airspace',
        },
        {
            title: 'EASA CAT.OP.MPA.180',
            desc: 'Fuel reserves policy for jet aeroplanes: Contingency fuel must be 5% of trip fuel or min 5 minutes',
            cat: 'fuel',
        },
    ];

    const searchResults = wikiRegulations.filter(
        (reg) =>
            reg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-theme-bg flex overflow-hidden">
            {/* 1. LEFT SIDEBAR */}
            <Sidebar />

            {/* 2. MAIN LAYOUT CONTAINER */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* TOP HEADER */}
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {/* 3. MAIN WORKSPACE CONTENT */}
                <main className="flex-1 overflow-y-auto bg-theme-bg p-8">
                    {/* TAB: DASHBOARD */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* Top Banner (Flat Theme Theme) */}
                            <div className="relative overflow-hidden rounded border border-theme-border bg-theme-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                                        Welcome back, Captain.
                                    </h1>
                                    <p className="text-theme-text-main text-xs mt-1">
                                        Your next scheduled virtual checkride is in 6 days. Let's
                                        review standard SOP sequences.
                                    </p>
                                </div>
                                <div className="bg-theme-extra-light border border-theme-border rounded px-4 py-2 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-theme-success"></div>
                                    <div className="text-left font-mono">
                                        <div className="text-xs text-theme-text-muted uppercase leading-none font-semibold">
                                            HOMEBASE METAR
                                        </div>
                                        <div className="text-xs text-theme-text-dark font-bold mt-1">
                                            EGLL 240/12KT 9999 FEW025
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
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-theme-success-light text-theme-success border border-theme-border-soft">
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
                                        <div
                                            className="bg-theme-brand h-full"
                                            style={{ width: '78%' }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="bg-theme-card border border-theme-border rounded p-5 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <span className="text-theme-text-muted text-xs font-semibold uppercase tracking-wider">
                                            Flow Accuracy
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-theme-info-light text-theme-info border border-theme-border-soft">
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
                                        <div
                                            className="bg-theme-brand h-full"
                                            style={{ width: '92%' }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="bg-theme-card border border-theme-border rounded p-5 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <span className="text-theme-text-muted text-xs font-semibold uppercase tracking-wider">
                                            Active Streak
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-amber-700 font-semibold">
                                            <IconFlame className="w-3 h-3 fill-amber-500 stroke-none" />{' '}
                                            HOT
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
                                        <div
                                            className="bg-amber-500 h-full"
                                            style={{ width: '66%' }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="bg-theme-card border border-theme-border rounded p-5 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <span className="text-theme-text-muted text-xs font-semibold uppercase tracking-wider">
                                            Briefed Routes
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-theme-bg text-theme-text-main border border-theme-border-soft">
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
                                        <div
                                            className="bg-theme-success h-full"
                                            style={{ width: '100%' }}
                                        ></div>
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
                                                    Averages calculated across active simulation
                                                    attempts
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
                                                <div className="w-full border-t border-theme-border pt-1">
                                                    100%
                                                </div>
                                                <div className="w-full border-t border-theme-error pt-1 border-dashed opacity-50">
                                                    75% (Pass Threshold)
                                                </div>
                                                <div className="w-full border-t border-theme-border pt-1">
                                                    50%
                                                </div>
                                                <div className="w-full border-t border-theme-border pt-1">
                                                    25%
                                                </div>
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
                                            <IconWarning className="w-5 h-5 text-amber-500" />
                                            <h3 className="font-bold text-theme-text-dark text-sm">
                                                Cognitive Retention Alert
                                            </h3>
                                        </div>
                                        <p className="text-xs text-theme-text-main leading-relaxed mb-4">
                                            Our spaced repetition algorithm has identified drops in
                                            visual cockpit flow retention and meteorological formula
                                            calculations. We recommend reviewing the following items
                                            today:
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
                                                    onClick={() => {
                                                        setActiveTab('qbank');
                                                        setSelectedAnswer(null);
                                                        setQSubmitted(false);
                                                    }}
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
                                                    onClick={() => {
                                                        setActiveTab('flows');
                                                        resetFlow();
                                                    }}
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
                                                    onClick={() => setActiveTab('briefing')}
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
                                                    onClick={() => setActiveTab('qbank')}
                                                    className="text-xs px-3 py-1 bg-slate-200 text-slate-700 border border-theme-border-soft rounded font-semibold hover:bg-slate-300 transition-colors"
                                                >
                                                    Open
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: ATPL Q-BANK */}
                    {activeTab === 'qbank' && (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                                        ATPL Exam Preparation
                                    </h1>
                                    <p className="text-theme-text-main text-xs mt-1">
                                        Study deck synchronized with EASA ECQB guidelines.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-theme-card border border-theme-border rounded px-4 py-2 flex items-center gap-2 shadow-sm">
                                        <span className="text-xs text-theme-text-muted">
                                            Streak:
                                        </span>
                                        <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                            <IconFlame className="w-4 h-4 fill-amber-500 stroke-none" />{' '}
                                            {qStreak} Days
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsQuestionFlagged(!isQuestionFlagged)}
                                        className={`px-4 py-2 border rounded text-xs font-semibold transition-all shadow-sm ${
                                            isQuestionFlagged
                                                ? 'bg-amber-500 text-white border-amber-500'
                                                : 'bg-theme-card border-theme-border text-theme-text-main hover:text-theme-text-dark'
                                        }`}
                                    >
                                        {isQuestionFlagged ? '★ Flagged' : '☆ Flag Question'}
                                    </button>
                                </div>
                            </div>

                            {/* Main Quiz & E6B Panel Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Interactive Question Card */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-theme-card border border-theme-border rounded p-6 space-y-6 shadow-sm">
                                        {/* Header bar */}
                                        <div className="flex justify-between items-center text-xs font-mono border-b border-theme-border pb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-theme-brand font-bold">
                                                    QUESTION 10243
                                                </span>
                                                <span className="text-slate-355">|</span>
                                                <span className="text-theme-text-main">
                                                    Subject 061 General Navigation
                                                </span>
                                            </div>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-theme-extra-light text-theme-text-muted">
                                                ECQB LO: 061.02.01
                                            </span>
                                        </div>

                                        {/* Question text */}
                                        <div className="text-theme-text-main text-xs leading-relaxed">
                                            A flight is planned from London to Paris. The flight
                                            planning data shows:
                                            <div className="mt-3 p-4 bg-theme-extra-light border border-theme-border rounded font-mono text-xs space-y-1 text-theme-text-dark">
                                                <div>True Heading (TH) = 095°</div>
                                                <div>Magnetic Variation (Var) = 7° West</div>
                                                <div>Compass Deviation (Dev) = 2° East</div>
                                            </div>
                                            <div className="mt-4 font-bold text-theme-text-dark">
                                                What is the corresponding Compass Heading (CH) for
                                                this flight stage?
                                            </div>
                                        </div>

                                        {/* Options list */}
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    id: 'A',
                                                    text: '104° (Applied deviation incorrectly)',
                                                },
                                                {
                                                    id: 'B',
                                                    text: '100° (Correct calculation applying West-add and East-subtract parameters)',
                                                },
                                                {
                                                    id: 'C',
                                                    text: '090° (Calculated using incorrect subtraction rules)',
                                                },
                                                {
                                                    id: 'D',
                                                    text: '086° (Opposite signs applied across calculations)',
                                                },
                                            ].map((opt) => {
                                                let btnStyle =
                                                    'border-theme-border bg-theme-card text-theme-text-main hover:border-slate-400 hover:bg-theme-bg';
                                                if (selectedAnswer === opt.id) {
                                                    btnStyle =
                                                        'border-theme-brand bg-theme-info-light text-theme-brand';
                                                }
                                                if (qSubmitted) {
                                                    if (opt.id === 'B') {
                                                        btnStyle =
                                                            'border-theme-success bg-theme-success-light text-theme-success';
                                                    } else if (selectedAnswer === opt.id) {
                                                        btnStyle =
                                                            'border-theme-error bg-theme-error-light text-theme-error';
                                                    } else {
                                                        btnStyle =
                                                            'border-theme-border bg-theme-card text-theme-text-muted pointer-events-none';
                                                    }
                                                }

                                                return (
                                                    <button
                                                        key={opt.id}
                                                        disabled={qSubmitted}
                                                        onClick={() => setSelectedAnswer(opt.id)}
                                                        className={`w-full flex items-center gap-4 p-4 rounded border text-left text-xs transition-all ${btnStyle}`}
                                                    >
                                                        <span className="w-7 h-7 rounded bg-theme-bg flex items-center justify-center font-mono font-bold text-xs shrink-0">
                                                            {opt.id}
                                                        </span>
                                                        <span>{opt.text}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex justify-between items-center border-t border-theme-border pt-6">
                                            <button
                                                onClick={() => {
                                                    setSelectedAnswer(null);
                                                    setQSubmitted(false);
                                                }}
                                                className="text-xs text-theme-text-muted hover:text-theme-text-main transition-colors"
                                            >
                                                Reset Question
                                            </button>
                                            <button
                                                disabled={!selectedAnswer || qSubmitted}
                                                onClick={() => setQSubmitted(true)}
                                                className={`px-5 py-2.5 rounded text-xs font-bold transition-all ${
                                                    !selectedAnswer || qSubmitted
                                                        ? 'bg-theme-bg text-theme-text-muted cursor-not-allowed'
                                                        : 'bg-theme-brand text-white hover:bg-theme-brand/90 shadow-sm'
                                                }`}
                                            >
                                                Submit Answer
                                            </button>
                                        </div>
                                    </div>

                                    {/* CFI Explanation details */}
                                    {qSubmitted && (
                                        <div className="bg-theme-card border border-theme-border rounded p-6 space-y-4 shadow-sm">
                                            <div className="flex items-center gap-2 text-theme-success">
                                                <IconCheck className="w-5 h-5 text-theme-success" />
                                                <h3 className="font-bold text-theme-text-dark text-sm">
                                                    CFI Explanation Verified
                                                </h3>
                                            </div>
                                            <p className="text-xs text-theme-text-main leading-relaxed">
                                                To calculate Compass Heading (CH) from True Heading
                                                (TH), we follow the standard navigation formula
                                                step-by-step:
                                            </p>
                                            <div className="p-4 bg-theme-extra-light border border-theme-border rounded font-mono text-xs text-theme-text-dark space-y-2">
                                                <div>
                                                    1. Convert True Heading to Magnetic Heading
                                                    (MH):
                                                </div>
                                                <div className="text-theme-brand pl-4 font-bold">
                                                    MH = TH ± Variation
                                                </div>
                                                <div className="text-theme-text-muted pl-4 font-sans">
                                                    Since Variation is West (7°W), we ADD Variation:
                                                </div>
                                                <div className="text-theme-brand pl-4 font-bold">
                                                    MH = 095° + 7° = 102° Magnetic
                                                </div>

                                                <div className="mt-3">
                                                    2. Convert Magnetic Heading to Compass Heading
                                                    (CH):
                                                </div>
                                                <div className="text-theme-brand pl-4 font-bold">
                                                    CH = MH ± Deviation
                                                </div>
                                                <div className="text-theme-text-muted pl-4 font-sans">
                                                    Since Deviation is East (2°E), we SUBTRACT
                                                    Deviation:
                                                </div>
                                                <div className="text-theme-brand pl-4 font-bold">
                                                    CH = 102° - 2° = 100° Compass
                                                </div>
                                            </div>

                                            {/* Peer Performance Stats */}
                                            <div className="border-t border-theme-border pt-4 flex flex-col md:flex-row justify-between gap-4 text-xs">
                                                <div className="flex items-center gap-2 text-theme-text-muted">
                                                    <span>Global Community Statistics:</span>
                                                    <span className="text-theme-brand font-bold">
                                                        58% Correct
                                                    </span>
                                                    <span>|</span>
                                                    <span className="text-theme-error font-bold">
                                                        42% Missed
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setActiveTab('wiki');
                                                        setWikiTab('airspace');
                                                        setWikiSearch('061.02');
                                                    }}
                                                    className="text-theme-brand font-semibold hover:text-theme-brand/80 transition-colors text-left"
                                                >
                                                    View Theory Wiki Section 061.02 →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: E6B Calculator Sandbox */}
                                <div className="space-y-6">
                                    <div className="bg-theme-card border border-theme-border rounded p-6 space-y-6 shadow-sm">
                                        <div className="flex items-center gap-2.5 border-b border-theme-border pb-4">
                                            <IconCalculator className="w-5 h-5 text-theme-brand" />
                                            <div>
                                                <h3 className="font-bold text-theme-text-dark text-sm">
                                                    E6B Wind Computer
                                                </h3>
                                                <p className="text-xs text-theme-text-muted">
                                                    Calculate wind correction & groundspeed
                                                </p>
                                            </div>
                                        </div>

                                        {/* Wind Triangle Parameters */}
                                        <div className="space-y-4 text-xs">
                                            {/* Wind Speed */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-theme-text-main">
                                                    <span>Wind Speed</span>
                                                    <span className="font-mono font-bold text-theme-text-dark">
                                                        {windSpeed} KTS
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="60"
                                                    value={windSpeed}
                                                    onChange={(e) =>
                                                        setWindSpeed(Number(e.target.value))
                                                    }
                                                    className="w-full h-1 bg-theme-bg rounded appearance-none cursor-pointer accent-theme-brand"
                                                />
                                            </div>

                                            {/* Wind Direction */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-theme-text-main">
                                                    <span>Wind Direction</span>
                                                    <span className="font-mono font-bold text-theme-text-dark">
                                                        {windDir}°
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="360"
                                                    value={windDir}
                                                    onChange={(e) =>
                                                        setWindDir(Number(e.target.value))
                                                    }
                                                    className="w-full h-1 bg-theme-bg rounded appearance-none cursor-pointer accent-theme-brand"
                                                />
                                            </div>

                                            {/* True Course */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-theme-text-main">
                                                    <span>True Course</span>
                                                    <span className="font-mono font-bold text-theme-text-dark">
                                                        {trueCourse}°
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="360"
                                                    value={trueCourse}
                                                    onChange={(e) =>
                                                        setTrueCourse(Number(e.target.value))
                                                    }
                                                    className="w-full h-1 bg-theme-bg rounded appearance-none cursor-pointer accent-theme-brand"
                                                />
                                            </div>

                                            {/* True Airspeed */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-theme-text-main">
                                                    <span>True Airspeed (TAS)</span>
                                                    <span className="font-mono font-bold text-theme-text-dark">
                                                        {trueAirspeed} KTS
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="80"
                                                    max="250"
                                                    value={trueAirspeed}
                                                    onChange={(e) =>
                                                        setTrueAirspeed(Number(e.target.value))
                                                    }
                                                    className="w-full h-1 bg-theme-bg rounded appearance-none cursor-pointer accent-theme-brand"
                                                />
                                            </div>
                                        </div>

                                        {/* Wind Triangle Results */}
                                        <div className="p-4 bg-theme-extra-light border border-theme-border rounded space-y-3 font-mono text-xs">
                                            <div className="flex justify-between text-theme-text-main">
                                                <span>Wind Correction Angle:</span>
                                                <span
                                                    className={`font-bold ${wcaDeg > 0 ? 'text-amber-600' : wcaDeg < 0 ? 'text-theme-brand' : 'text-theme-text-main'}`}
                                                >
                                                    {wcaDeg > 0 ? `+${wcaDeg}°` : `${wcaDeg}°`}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-theme-text-main">
                                                <span>Crosswind Component:</span>
                                                <span className="text-theme-text-dark font-bold">
                                                    {Math.abs(crosswind)} KTS{' '}
                                                    {crosswind > 0 ? 'R' : 'L'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-theme-text-main">
                                                <span>Headwind Component:</span>
                                                <span
                                                    className={`font-bold ${headwind >= 0 ? 'text-theme-success' : 'text-theme-error'}`}
                                                >
                                                    {headwind >= 0
                                                        ? `${headwind} KTS HW`
                                                        : `${Math.abs(headwind)} KTS TW`}
                                                </span>
                                            </div>
                                            <div className="border-t border-theme-border pt-2 flex justify-between text-theme-text-main font-sans text-xs">
                                                <span>Calculated Groundspeed:</span>
                                                <span className="text-theme-brand font-mono font-bold text-sm">
                                                    {groundSpeed} KTS
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: LEGISLATION WIKI */}
                    {activeTab === 'wiki' && (
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                                    EASA & ICAO Legislation Wiki
                                </h1>
                                <p className="text-theme-text-main text-xs mt-1">
                                    Cross-border aviation legal standards translated to plain
                                    English.
                                </p>
                            </div>

                            {/* Wiki Navigation Sub-Tabs */}
                            <div className="flex border-b border-theme-border">
                                <button
                                    onClick={() => setWikiTab('airspace')}
                                    className={`px-6 py-3 border-b-2 font-semibold text-xs transition-all ${
                                        wikiTab === 'airspace'
                                            ? 'border-theme-brand text-theme-brand'
                                            : 'border-transparent text-theme-text-muted hover:text-theme-text-main'
                                    }`}
                                >
                                    Airspace & Operations
                                </button>
                                <button
                                    onClick={() => setWikiTab('fuel')}
                                    className={`px-6 py-3 border-b-2 font-semibold text-xs transition-all ${
                                        wikiTab === 'fuel'
                                            ? 'border-theme-brand text-theme-brand'
                                            : 'border-transparent text-theme-text-muted hover:text-theme-text-main'
                                    }`}
                                >
                                    Fuel Reserves
                                </button>
                                <button
                                    onClick={() => setWikiTab('medical')}
                                    className={`px-6 py-3 border-b-2 font-semibold text-xs transition-all ${
                                        wikiTab === 'medical'
                                            ? 'border-theme-brand text-theme-brand'
                                            : 'border-transparent text-theme-text-muted hover:text-theme-text-main'
                                    }`}
                                >
                                    Medical Class References
                                </button>
                            </div>

                            {/* WIKI TAB: AIRSPACE & OPERATIONS */}
                            {wikiTab === 'airspace' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Search & Results */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-theme-card border border-theme-border rounded p-6 shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-theme-text-dark text-sm">
                                                    EASA Regulatory Lookups
                                                </h3>
                                                <span className="text-xs text-theme-text-muted font-mono">
                                                    Index database: 4,821 Articles
                                                </span>
                                            </div>

                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    placeholder="Search specific EASA Parts (e.g. Part-FCL, Part-CAT)..."
                                                    value={wikiSearch}
                                                    onChange={(e) => setWikiSearch(e.target.value)}
                                                    className="w-full bg-theme-bg border border-theme-border text-theme-text-dark px-4 py-2.5 rounded text-xs focus:outline-none focus:border-theme-brand transition-all"
                                                />

                                                <div className="space-y-3">
                                                    {searchResults
                                                        .filter(
                                                            (reg) =>
                                                                reg.cat === 'airspace' &&
                                                                (wikiSearch === '' ||
                                                                    reg.title
                                                                        .toLowerCase()
                                                                        .includes(
                                                                            wikiSearch.toLowerCase()
                                                                        ) ||
                                                                    reg.desc
                                                                        .toLowerCase()
                                                                        .includes(
                                                                            wikiSearch.toLowerCase()
                                                                        ))
                                                        )
                                                        .map((reg, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="p-4 bg-theme-extra-light border border-theme-border rounded hover:border-slate-400 transition-all"
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <h4 className="text-xs font-bold text-theme-brand font-mono">
                                                                        {reg.title}
                                                                    </h4>
                                                                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-650">
                                                                        EU Reg 1178/2011
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-theme-text-main mt-2 leading-relaxed">
                                                                    {reg.desc}
                                                                </p>
                                                                <div className="mt-3 flex justify-between items-center text-xs text-theme-text-muted font-mono border-t border-theme-border pt-2">
                                                                    <span>
                                                                        Reference: Section A.2
                                                                    </span>
                                                                    <a
                                                                        href="#link"
                                                                        onClick={(e) =>
                                                                            e.preventDefault()
                                                                        }
                                                                        className="text-theme-brand hover:underline"
                                                                    >
                                                                        Download Official PDF
                                                                        Backlink
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Airspace block chart visual */}
                                        <div className="bg-theme-card border border-theme-border rounded p-6 shadow-sm">
                                            <h3 className="font-bold text-theme-text-dark text-sm mb-4">
                                                Visual Airspace Structure
                                            </h3>
                                            <div className="w-full h-48 bg-theme-bg rounded p-4 flex flex-col justify-between border border-theme-border relative">
                                                {/* Class A */}
                                                <div className="flex items-center justify-between bg-theme-info-light border border-theme-border-soft p-2.5 rounded text-xs">
                                                    <span className="font-bold text-theme-brand font-mono">
                                                        CLASS A (FL195 to FL660)
                                                    </span>
                                                    <span className="text-xs text-theme-error font-mono font-semibold">
                                                        IFR ONLY | ATC Clearance Required
                                                    </span>
                                                </div>
                                                {/* Class C */}
                                                <div className="flex items-center justify-between bg-theme-info-light border border-theme-border-soft p-2.5 rounded text-xs">
                                                    <span className="font-bold text-theme-brand font-mono">
                                                        CLASS C (FL115 to FL195)
                                                    </span>
                                                    <span className="text-xs text-theme-text-main font-mono">
                                                        IFR + VFR Allowed | VFR Speed &lt;250kts
                                                    </span>
                                                </div>
                                                {/* Class G */}
                                                <div className="flex items-center justify-between bg-theme-extra-light border border-theme-border p-2.5 rounded text-xs">
                                                    <span className="font-bold text-theme-text-muted font-mono">
                                                        CLASS G (Uncontrolled Surface to 3000FT)
                                                    </span>
                                                    <span className="text-xs text-theme-success font-mono font-semibold">
                                                        No ATC Clearance Req | Transponder Optional
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Comparative matrix */}
                                    <div className="space-y-6">
                                        <div className="bg-theme-card border border-theme-border rounded p-6 space-y-4 shadow-sm">
                                            <h3 className="font-bold text-theme-text-dark text-sm">
                                                EASA vs. FAA Comparison Matrix
                                            </h3>
                                            <p className="text-xs text-theme-text-muted leading-relaxed">
                                                Regulatory harmonization mapping for trans-atlantic
                                                operations.
                                            </p>

                                            <div className="space-y-4 text-xs">
                                                <div className="p-4 bg-theme-extra-light border border-theme-border rounded space-y-2">
                                                    <div className="font-bold text-theme-text-dark">
                                                        VFR in Class A Airspace
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                        <div>
                                                            <div className="text-xs uppercase font-mono text-theme-text-muted font-bold">
                                                                EASA Part-FCL
                                                            </div>
                                                            <div className="text-theme-error mt-1 font-semibold">
                                                                Strictly Prohibited
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs uppercase font-mono text-theme-text-muted font-bold">
                                                                FAA FAR 91
                                                            </div>
                                                            <div className="text-amber-700 mt-1 font-semibold">
                                                                Allowed with ATC waiver
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-theme-extra-light border border-theme-border rounded space-y-2">
                                                    <div className="font-bold text-theme-text-dark">
                                                        Transition Altitude standard
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                        <div>
                                                            <div className="text-xs uppercase font-mono text-theme-text-muted font-bold">
                                                                EASA standard
                                                            </div>
                                                            <div className="text-theme-text-main mt-1">
                                                                Variable (e.g. 3,000ft to 6,000ft
                                                                based on local airport authority)
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs uppercase font-mono text-theme-text-muted font-bold">
                                                                FAA standard
                                                            </div>
                                                            <div className="text-theme-text-main mt-1">
                                                                Fixed at 18,000ft MSL across US
                                                                airspace
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* WIKI TAB: FUEL RESERVES */}
                            {wikiTab === 'fuel' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Regulation explanation */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-theme-card border border-theme-border rounded p-6 space-y-4 shadow-sm">
                                            <h3 className="font-bold text-theme-text-dark text-sm">
                                                EASA Jet Fuel Policy (CAT.OP.MPA.180)
                                            </h3>
                                            <p className="text-xs text-theme-text-main leading-relaxed">
                                                Under European Commercial Air Transport regulations,
                                                the minimum block fuel loaded on board a jet
                                                aircraft must follow the structured parameters below
                                                to protect against diversion contingencies.
                                            </p>

                                            <div className="space-y-3 font-mono text-xs">
                                                <div className="p-3.5 bg-theme-extra-light border border-theme-border rounded flex justify-between items-center">
                                                    <div>
                                                        <span className="text-theme-text-dark font-bold">
                                                            1. Taxi Fuel
                                                        </span>
                                                        <div className="text-xs text-theme-text-muted font-sans mt-0.5">
                                                            Calculated fuel burn before take-off
                                                            roll
                                                        </div>
                                                    </div>
                                                    <span className="text-theme-brand font-bold font-sans text-xs">
                                                        Actual Expected APU/Taxi
                                                    </span>
                                                </div>

                                                <div className="p-3.5 bg-theme-extra-light border border-theme-border rounded flex justify-between items-center">
                                                    <div>
                                                        <span className="text-theme-text-dark font-bold">
                                                            2. Trip Fuel
                                                        </span>
                                                        <div className="text-xs text-theme-text-muted font-sans mt-0.5">
                                                            Climb, Cruise, Descent, and Instrument
                                                            Approach at destination
                                                        </div>
                                                    </div>
                                                    <span className="text-theme-brand font-bold font-sans text-xs">
                                                        Expected Wind Profile
                                                    </span>
                                                </div>

                                                <div className="p-3.5 bg-theme-extra-light border border-theme-border rounded flex justify-between items-center">
                                                    <div>
                                                        <span className="text-theme-text-dark font-bold">
                                                            3. Contingency Fuel
                                                        </span>
                                                        <div className="text-xs text-theme-text-muted font-sans mt-0.5">
                                                            Higher of 5% of trip fuel OR 3 minutes
                                                            holding at 1500ft
                                                        </div>
                                                    </div>
                                                    <span className="text-amber-700 font-bold font-sans text-xs">
                                                        Min 5% / 5 Min
                                                    </span>
                                                </div>

                                                <div className="p-3.5 bg-theme-extra-light border border-theme-border rounded flex justify-between items-center">
                                                    <div>
                                                        <span className="text-theme-text-dark font-bold">
                                                            4. Alternate Fuel
                                                        </span>
                                                        <div className="text-xs text-theme-text-muted font-sans mt-0.5">
                                                            Fuel to execute missed approach at
                                                            destination, climb, cruise, and land at
                                                            alternate
                                                        </div>
                                                    </div>
                                                    <span className="text-theme-brand font-bold font-sans text-xs">
                                                        Required (unless isolated)
                                                    </span>
                                                </div>

                                                <div className="p-3.5 bg-theme-extra-light border border-theme-border rounded flex justify-between items-center">
                                                    <div>
                                                        <span className="text-theme-text-dark font-bold">
                                                            5. Final Reserve Fuel
                                                        </span>
                                                        <div className="text-xs text-theme-text-muted font-sans mt-0.5">
                                                            Hold for 30 minutes at 1,500ft above
                                                            alternate airport elevation
                                                        </div>
                                                    </div>
                                                    <span className="text-theme-error font-bold font-sans text-xs">
                                                        30 MINS JET (45 MIN PISTON)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Comparative matrix */}
                                    <div className="space-y-6">
                                        <div className="bg-theme-card border border-theme-border rounded p-6 space-y-4 shadow-sm">
                                            <h3 className="text-theme-text-dark text-sm font-semibold">
                                                Fuel Reserves Comparison
                                            </h3>
                                            <div className="space-y-4 text-xs">
                                                <div className="p-4 bg-theme-extra-light border border-theme-border rounded">
                                                    <div className="font-bold text-theme-text-dark">
                                                        Piston Aeroplane Reserves
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                        <div>
                                                            <div className="text-xs text-theme-text-muted font-mono font-bold uppercase">
                                                                EASA
                                                            </div>
                                                            <div className="text-theme-text-main mt-0.5 font-semibold">
                                                                45 Minutes
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-theme-text-muted font-mono font-bold uppercase">
                                                                FAA
                                                            </div>
                                                            <div className="text-theme-text-main mt-0.5 font-semibold">
                                                                30 Min Day / 45 Min Night
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-theme-extra-light border border-theme-border rounded">
                                                    <div className="font-bold text-theme-text-dark">
                                                        Jet Aeroplane Reserves
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                        <div>
                                                            <div className="text-xs text-theme-text-muted font-mono font-bold uppercase">
                                                                EASA
                                                            </div>
                                                            <div className="text-theme-text-main mt-0.5 font-semibold">
                                                                30 Minutes
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-theme-text-muted font-mono font-bold uppercase">
                                                                FAA
                                                            </div>
                                                            <div className="text-theme-text-main mt-0.5 font-semibold">
                                                                45 Minutes IFR
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* WIKI TAB: MEDICAL REFERENCES */}
                            {wikiTab === 'medical' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Age/Class selector */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-theme-card border border-theme-border rounded p-6 space-y-6 shadow-sm">
                                            <h3 className="font-bold text-theme-text-dark text-sm">
                                                Medical Revalidation Period Lookup
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Select Medical Class */}
                                                <div className="space-y-2">
                                                    <label className="text-xs text-theme-text-muted font-bold uppercase tracking-wider">
                                                        Medical Certificate Class
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <button
                                                            onClick={() =>
                                                                setMedicalClass('class1')
                                                            }
                                                            className={`py-2 text-xs font-semibold rounded border transition-all ${
                                                                medicalClass === 'class1'
                                                                    ? 'bg-theme-info-light text-theme-brand border-theme-brand shadow-sm font-semibold'
                                                                    : 'bg-theme-card text-theme-text-main border-theme-border hover:text-theme-text-dark'
                                                            }`}
                                                        >
                                                            Class 1
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setMedicalClass('class2')
                                                            }
                                                            className={`py-2 text-xs font-semibold rounded border transition-all ${
                                                                medicalClass === 'class2'
                                                                    ? 'bg-theme-info-light text-theme-brand border-theme-brand shadow-sm font-semibold'
                                                                    : 'bg-theme-card text-theme-text-main border-theme-border hover:text-theme-text-dark'
                                                            }`}
                                                        >
                                                            Class 2
                                                        </button>
                                                        <button
                                                            onClick={() => setMedicalClass('lapl')}
                                                            className={`py-2 text-xs font-semibold rounded border transition-all ${
                                                                medicalClass === 'lapl'
                                                                    ? 'bg-theme-info-light text-theme-brand border-theme-brand shadow-sm font-semibold'
                                                                    : 'bg-theme-card text-theme-text-main border-theme-border hover:text-theme-text-dark'
                                                            }`}
                                                        >
                                                            LAPL
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Select Age Band */}
                                                <div className="space-y-2">
                                                    <label className="text-xs text-theme-text-muted font-bold uppercase tracking-wider">
                                                        Applicant Age Band
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <button
                                                            onClick={() => setMedicalAge('under40')}
                                                            className={`py-2 text-xs font-semibold rounded border transition-all ${
                                                                medicalAge === 'under40'
                                                                    ? 'bg-theme-info-light text-theme-brand border-theme-brand shadow-sm font-semibold'
                                                                    : 'bg-theme-card text-theme-text-main border-theme-border hover:text-theme-text-dark'
                                                            }`}
                                                        >
                                                            &lt; 40 Yrs
                                                        </button>
                                                        <button
                                                            onClick={() => setMedicalAge('40to50')}
                                                            className={`py-2 text-xs font-semibold rounded border transition-all ${
                                                                medicalAge === '40to50'
                                                                    ? 'bg-theme-info-light text-theme-brand border-theme-brand shadow-sm font-semibold'
                                                                    : 'bg-theme-card text-theme-text-main border-theme-border hover:text-theme-text-dark'
                                                            }`}
                                                        >
                                                            40 - 50 Yrs
                                                        </button>
                                                        <button
                                                            onClick={() => setMedicalAge('over50')}
                                                            className={`py-2 text-xs font-semibold rounded border transition-all ${
                                                                medicalAge === 'over50'
                                                                    ? 'bg-theme-info-light text-theme-brand border-theme-brand shadow-sm font-semibold'
                                                                    : 'bg-theme-card text-theme-text-main border-theme-border hover:text-theme-text-dark'
                                                            }`}
                                                        >
                                                            &gt; 50 Yrs
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Display revalidation result */}
                                            <div className="p-6 bg-theme-extra-light border border-theme-border rounded space-y-4">
                                                <div className="flex justify-between items-center border-b border-theme-border pb-3">
                                                    <span className="text-theme-text-muted text-xs font-bold font-mono">
                                                        REVALIDATION CYCLE
                                                    </span>
                                                    <span className="text-xs px-2.5 py-0.5 rounded bg-theme-info-light text-theme-brand border border-theme-border-soft font-bold uppercase">
                                                        {medicalClass}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <div className="text-xs text-theme-text-muted uppercase font-mono font-bold">
                                                            EASA Revalidation Period
                                                        </div>
                                                        <div className="text-xl font-bold text-theme-text-dark mt-1">
                                                            {medicalClass === 'class1' &&
                                                                medicalAge === 'under40' &&
                                                                '12 Months'}
                                                            {medicalClass === 'class1' &&
                                                                medicalAge === '40to50' &&
                                                                '12 Months'}
                                                            {medicalClass === 'class1' &&
                                                                medicalAge === 'over50' &&
                                                                '6 Months'}

                                                            {medicalClass === 'class2' &&
                                                                medicalAge === 'under40' &&
                                                                '60 Months'}
                                                            {medicalClass === 'class2' &&
                                                                medicalAge === '40to50' &&
                                                                '24 Months'}
                                                            {medicalClass === 'class2' &&
                                                                medicalAge === 'over50' &&
                                                                '12 Months'}

                                                            {medicalClass === 'lapl' &&
                                                                medicalAge === 'under40' &&
                                                                '60 Months'}
                                                            {medicalClass === 'lapl' &&
                                                                medicalAge === '40to50' &&
                                                                '24 Months'}
                                                            {medicalClass === 'lapl' &&
                                                                medicalAge === 'over50' &&
                                                                '24 Months'}
                                                        </div>
                                                        <p className="text-xs text-theme-text-main mt-2">
                                                            {medicalClass === 'class1' &&
                                                                'Required for Commercial Pilot Licenses (ATPL, CPL, MPL).'}
                                                            {medicalClass === 'class2' &&
                                                                'Required for Private Pilot Licenses (PPL, Balloon, Sailplane).'}
                                                            {medicalClass === 'lapl' &&
                                                                'Required for Light Aircraft Pilot Licenses.'}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <div className="text-xs text-theme-text-muted uppercase font-mono font-bold">
                                                            Special requirements
                                                        </div>
                                                        <div className="text-xs font-semibold text-theme-text-main mt-2">
                                                            {medicalClass === 'class1' &&
                                                                medicalAge !== 'under40' &&
                                                                'Requires ECG testing at regular intervals and detailed cardiovascular review.'}
                                                            {medicalClass === 'class1' &&
                                                                medicalAge === 'under40' &&
                                                                'Standard auditory, visual, and blood profile checks.'}
                                                            {medicalClass === 'class2' &&
                                                                'Audiometry required only if Instrument Rating is attached.'}
                                                            {medicalClass === 'lapl' &&
                                                                'Standard declaration, no mandatory specialist aviation medical examiner review unless pathology found.'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Conditions warning */}
                                    <div className="space-y-6">
                                        <div className="bg-theme-card border border-theme-border rounded p-6 space-y-4 shadow-sm">
                                            <h3 className="font-bold text-theme-text-dark text-sm font-semibold">
                                                Disqualifying Conditions
                                            </h3>
                                            <p className="text-xs text-theme-text-muted leading-relaxed">
                                                The following medical diagnoses constitute an
                                                immediate suspension of flight medical validity
                                                under Part-MED.
                                            </p>
                                            <ul className="space-y-3.5 text-xs text-theme-text-main">
                                                <li className="flex items-start gap-2.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-theme-error mt-1.5 shrink-0"></span>
                                                    <span>
                                                        <strong>Cardiac:</strong> Active angina,
                                                        myocardial infarction history, or heart
                                                        valve replacement.
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-theme-error mt-1.5 shrink-0"></span>
                                                    <span>
                                                        <strong>Neurological:</strong> Unexplained
                                                        loss of consciousness, epilepsy diagnosis,
                                                        or recurrent migraine triggers.
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-theme-error mt-1.5 shrink-0"></span>
                                                    <span>
                                                        <strong>Vision:</strong> Binocular visual
                                                        acuity less than 6/9 (0.7) in each eye
                                                        separately or color blindness (Class 1).
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: FLOWS TRAINER */}
                    {activeTab === 'flows' && (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                                        Procedure Flows Trainer
                                    </h1>
                                    <p className="text-theme-text-main text-xs mt-1">
                                        Practice aircraft systems startup and memory flows in high
                                        fidelity.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setBlindMode(!blindMode)}
                                        className={`px-4 py-2 border rounded text-xs font-semibold transition-all shadow-sm ${
                                            blindMode
                                                ? 'bg-theme-error-light text-theme-error border-theme-error'
                                                : 'bg-theme-card border-theme-border text-theme-text-main hover:text-theme-text-dark'
                                        }`}
                                    >
                                        {blindMode
                                            ? '🔒 Blind Mode Active'
                                            : '🔓 Blind Mode Disabled'}
                                    </button>
                                    <button
                                        onClick={resetFlow}
                                        className="px-4 py-2 border border-theme-border bg-theme-card text-theme-text-main hover:bg-theme-bg rounded text-xs font-semibold transition-all shadow-sm"
                                    >
                                        Reset Trainer
                                    </button>
                                </div>
                            </div>

                            {/* Main cockpit simulator layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Columns: Virtual overhead panel */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-theme-card border border-theme-border rounded p-6 shadow-sm">
                                        <div className="flex justify-between items-center border-b border-theme-border pb-4 mb-6">
                                            <div>
                                                <h3 className="font-bold text-theme-text-dark text-sm">
                                                    A320 Mock Overhead Panel
                                                </h3>
                                                <p className="text-xs text-theme-text-muted">
                                                    Click elements in the correct checklist order
                                                </p>
                                            </div>
                                            {/* Live score indicator */}
                                            <div className="text-right font-mono">
                                                <div className="text-xs text-theme-text-muted font-sans font-bold">
                                                    CHECKRIDE SCORE
                                                </div>
                                                <div
                                                    className={`text-sm font-bold ${flowErrors > 2 ? 'text-theme-error' : flowErrors > 0 ? 'text-amber-600' : 'text-theme-success'}`}
                                                >
                                                    {Math.max(100 - flowErrors * 15, 0)}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cockpit representation with flat backgrounds */}
                                        <div className="w-full bg-theme-extra-light border border-theme-border rounded p-8 relative flex flex-col items-center">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-xl">
                                                {/* Battery Switch Button */}
                                                <button
                                                    onClick={() => handleFlowAction('battery')}
                                                    className={`h-24 rounded border flex flex-col justify-between p-3 transition-all relative overflow-hidden ${
                                                        panelState.battery
                                                            ? 'border-theme-success bg-theme-success-light text-theme-success'
                                                            : 'border-theme-border bg-theme-card text-theme-text-main hover:border-slate-400'
                                                    }`}
                                                >
                                                    <span className="text-xs font-mono text-theme-text-muted uppercase">
                                                        ELEC BUS
                                                    </span>
                                                    <span className="text-xs font-bold text-center w-full">
                                                        {blindMode && flowStep !== 0
                                                            ? '???'
                                                            : 'BATTERY'}
                                                    </span>
                                                    <div className="flex justify-between items-center w-full">
                                                        <span className="text-xs font-mono">
                                                            {panelState.battery ? 'ON' : 'OFF'}
                                                        </span>
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${panelState.battery ? 'bg-theme-success' : 'bg-slate-300'}`}
                                                        ></span>
                                                    </div>
                                                </button>

                                                {/* APU Master Switch */}
                                                <button
                                                    onClick={() => handleFlowAction('apuMaster')}
                                                    className={`h-24 rounded border flex flex-col justify-between p-3 transition-all relative overflow-hidden ${
                                                        panelState.apuMaster
                                                            ? 'border-theme-success bg-theme-success-light text-theme-success'
                                                            : 'border-theme-border bg-theme-card text-theme-text-main hover:border-slate-400'
                                                    }`}
                                                >
                                                    <span className="text-xs font-mono text-theme-text-muted uppercase">
                                                        APU SYS
                                                    </span>
                                                    <span className="text-xs font-bold text-center w-full">
                                                        {blindMode && flowStep !== 1
                                                            ? '???'
                                                            : 'APU MASTER'}
                                                    </span>
                                                    <div className="flex justify-between items-center w-full">
                                                        <span className="text-xs font-mono">
                                                            {panelState.apuMaster ? 'ON' : 'OFF'}
                                                        </span>
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${panelState.apuMaster ? 'bg-theme-success' : 'bg-slate-300'}`}
                                                        ></span>
                                                    </div>
                                                </button>

                                                {/* APU Start button */}
                                                <button
                                                    onClick={() => handleFlowAction('apuStart')}
                                                    className={`h-24 rounded border flex flex-col justify-between p-3 transition-all relative overflow-hidden ${
                                                        panelState.apuStart
                                                            ? 'border-theme-success bg-theme-success-light text-theme-success'
                                                            : 'border-theme-border bg-theme-card text-theme-text-main hover:border-slate-400'
                                                    }`}
                                                >
                                                    <span className="text-xs font-mono text-theme-text-muted uppercase">
                                                        APU START
                                                    </span>
                                                    <span className="text-xs font-bold text-center w-full">
                                                        {blindMode && flowStep !== 2
                                                            ? '???'
                                                            : 'START'}
                                                    </span>
                                                    <div className="flex justify-between items-center w-full">
                                                        <span className="text-xs font-mono">
                                                            {panelState.apuStart
                                                                ? 'RUNNING'
                                                                : 'START'}
                                                        </span>
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${panelState.apuStart ? 'bg-theme-success' : 'bg-slate-300'}`}
                                                        ></span>
                                                    </div>
                                                </button>

                                                {/* APU Generator Switch */}
                                                <button
                                                    onClick={() => handleFlowAction('apuGen')}
                                                    className={`h-24 rounded border flex flex-col justify-between p-3 transition-all relative overflow-hidden ${
                                                        panelState.apuGen
                                                            ? 'border-theme-success bg-theme-success-light text-theme-success'
                                                            : 'border-theme-border bg-theme-card text-theme-text-main hover:border-slate-400'
                                                    }`}
                                                >
                                                    <span className="text-xs font-mono text-theme-text-muted uppercase">
                                                        AC BUS
                                                    </span>
                                                    <span className="text-xs font-bold text-center w-full">
                                                        {blindMode && flowStep !== 3
                                                            ? '???'
                                                            : 'APU GEN'}
                                                    </span>
                                                    <div className="flex justify-between items-center w-full">
                                                        <span className="text-xs font-mono">
                                                            {panelState.apuGen ? 'AVAIL' : 'OFF'}
                                                        </span>
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${panelState.apuGen ? 'bg-theme-success' : 'bg-slate-300'}`}
                                                        ></span>
                                                    </div>
                                                </button>

                                                {/* Fuel Pump Switch */}
                                                <button
                                                    onClick={() => handleFlowAction('fuelPumps')}
                                                    className={`h-24 rounded border flex flex-col justify-between p-3 transition-all relative overflow-hidden ${
                                                        panelState.fuelPumps
                                                            ? 'border-theme-success bg-theme-success-light text-theme-success'
                                                            : 'border-theme-border bg-theme-card text-theme-text-main hover:border-slate-400'
                                                    }`}
                                                >
                                                    <span className="text-xs font-mono text-theme-text-muted uppercase">
                                                        FUEL SYS
                                                    </span>
                                                    <span className="text-xs font-bold text-center w-full">
                                                        {blindMode && flowStep !== 4
                                                            ? '???'
                                                            : 'FUEL PUMPS'}
                                                    </span>
                                                    <div className="flex justify-between items-center w-full">
                                                        <span className="text-xs font-mono">
                                                            {panelState.fuelPumps ? 'ON' : 'OFF'}
                                                        </span>
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${panelState.fuelPumps ? 'bg-theme-success' : 'bg-slate-300'}`}
                                                        ></span>
                                                    </div>
                                                </button>

                                                {/* Engine Ignition Start Dial selector */}
                                                <button
                                                    onClick={() =>
                                                        handleFlowAction('ignitionStart')
                                                    }
                                                    className={`h-24 rounded border flex flex-col justify-between p-3 transition-all relative overflow-hidden ${
                                                        panelState.engIgnition === 'start1'
                                                            ? 'border-theme-success bg-theme-success-light text-theme-success'
                                                            : 'border-theme-border bg-theme-card text-theme-text-main hover:border-slate-400'
                                                    }`}
                                                >
                                                    <span className="text-xs font-mono text-theme-text-muted uppercase">
                                                        IGNITION
                                                    </span>
                                                    <span className="text-xs font-bold text-center w-full">
                                                        {blindMode && flowStep !== 5
                                                            ? '???'
                                                            : 'ENG SEL'}
                                                    </span>
                                                    <div className="flex justify-between items-center w-full">
                                                        <span className="text-xs font-mono">
                                                            {panelState.engIgnition === 'start1'
                                                                ? 'START'
                                                                : 'NORM'}
                                                        </span>
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${panelState.engIgnition === 'start1' ? 'bg-theme-success' : 'bg-slate-300'}`}
                                                        ></span>
                                                    </div>
                                                </button>

                                                {/* Engine 1 Master Switch */}
                                                <button
                                                    onClick={() => handleFlowAction('eng1Start')}
                                                    className={`h-24 rounded border flex flex-col justify-between p-3 transition-all relative overflow-hidden ${
                                                        panelState.eng1Start
                                                            ? 'border-theme-success bg-theme-success-light text-theme-success'
                                                            : 'border-theme-border bg-theme-card text-theme-text-main hover:border-slate-400'
                                                    }`}
                                                >
                                                    <span className="text-xs font-mono text-theme-text-muted uppercase">
                                                        ENG 1 SYS
                                                    </span>
                                                    <span className="text-xs font-bold text-center w-full">
                                                        {blindMode && flowStep !== 6
                                                            ? '???'
                                                            : 'ENG 1 MASTER'}
                                                    </span>
                                                    <div className="flex justify-between items-center w-full">
                                                        <span className="text-xs font-mono">
                                                            {panelState.eng1Start ? 'ON' : 'OFF'}
                                                        </span>
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${panelState.eng1Start ? 'bg-theme-success' : 'bg-slate-300'}`}
                                                        ></span>
                                                    </div>
                                                </button>
                                            </div>

                                            {/* Diagnostic HUD */}
                                            <div className="w-full mt-6 bg-theme-card border border-theme-border p-4 rounded flex justify-between text-xs font-mono text-theme-text-muted shadow-sm">
                                                <div>
                                                    DC Bus:{' '}
                                                    <span
                                                        className={
                                                            panelState.battery
                                                                ? 'text-theme-success font-bold'
                                                                : 'text-theme-text-muted'
                                                        }
                                                    >
                                                        {panelState.battery ? '28.2V' : '0.0V'}
                                                    </span>
                                                </div>
                                                <div>
                                                    APU RPM:{' '}
                                                    <span
                                                        className={
                                                            panelState.apuStart
                                                                ? 'text-theme-success font-bold'
                                                                : 'text-theme-text-muted'
                                                        }
                                                    >
                                                        {panelState.apuStart ? '100%' : '0%'}
                                                    </span>
                                                </div>
                                                <div>
                                                    Fuel Pressure:{' '}
                                                    <span
                                                        className={
                                                            panelState.fuelPumps
                                                                ? 'text-theme-success font-bold'
                                                                : 'text-theme-text-muted'
                                                        }
                                                    >
                                                        {panelState.fuelPumps ? 'NORMAL' : 'LOW'}
                                                    </span>
                                                </div>
                                                <div>
                                                    N2 Turbine:{' '}
                                                    <span
                                                        className={
                                                            panelState.eng1Start
                                                                ? 'text-theme-success font-bold'
                                                                : 'text-theme-text-muted'
                                                        }
                                                    >
                                                        {panelState.eng1Start ? '58.4%' : '0.0%'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Flow Steps checklist and log history */}
                                <div className="space-y-6">
                                    {/* Current flow action card */}
                                    <div className="bg-theme-card border border-theme-border rounded p-6 shadow-sm">
                                        <h3 className="font-bold text-theme-text-dark text-sm mb-4">
                                            SOP Checklist Sequence
                                        </h3>
                                        <div className="space-y-3 text-xs">
                                            {flowsSteps.map((step, idx) => {
                                                let stepStyle =
                                                    'text-theme-text-muted border-transparent bg-theme-bg';
                                                let bulletStyle =
                                                    'bg-slate-200 text-theme-text-muted';
                                                if (idx === flowStep) {
                                                    stepStyle =
                                                        'text-amber-700 border-amber-300 bg-amber-50 font-bold scale-[1.02] shadow-sm';
                                                    bulletStyle =
                                                        'bg-amber-500 text-slate-950 font-extrabold';
                                                } else if (idx < flowStep) {
                                                    stepStyle =
                                                        'text-theme-text-muted border-theme-border bg-theme-extra-light line-through opacity-60';
                                                    bulletStyle = 'bg-theme-success text-white';
                                                }

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`p-3 border rounded flex items-center gap-3 transition-all ${stepStyle}`}
                                                    >
                                                        <span
                                                            className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${bulletStyle}`}
                                                        >
                                                            {idx < flowStep ? '✓' : idx + 1}
                                                        </span>
                                                        <span>{step.text}</span>
                                                    </div>
                                                );
                                            })}

                                            {flowStep >= flowsSteps.length && (
                                                <div className="p-4 bg-theme-success-light border border-theme-border-soft rounded text-center text-theme-success font-bold mt-4">
                                                    🎉 PROCEDURAL FLOW COMPLETED SUCCESSFULLY!
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Flow History Logs */}
                                    <div className="bg-theme-card border border-theme-border rounded p-6 shadow-sm">
                                        <h3 className="font-bold text-theme-text-dark text-sm">
                                            Action Logger
                                        </h3>
                                        <div className="h-44 overflow-y-auto bg-theme-bg border border-theme-border rounded p-3 font-mono text-xs space-y-2 text-theme-text-muted">
                                            {flowHistory.length === 0 ? (
                                                <div className="text-center text-theme-text-muted mt-12">
                                                    No actions recorded yet. Begin startup flow.
                                                </div>
                                            ) : (
                                                flowHistory.map((log, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={
                                                            log.includes('Success')
                                                                ? 'text-theme-text-dark font-semibold'
                                                                : 'text-amber-700 font-bold'
                                                        }
                                                    >
                                                        {log}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: FLIGHT BRIEFING */}
                    {activeTab === 'briefing' && (
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                                    Pre-Flight Planning & Briefing
                                </h1>
                                <p className="text-theme-text-main text-xs mt-1">
                                    Ingest live METAR/TAF weather feeds and compile threat
                                    mitigations.
                                </p>
                            </div>

                            {/* Input details bar */}
                            <div className="p-4 bg-theme-card border border-theme-border rounded flex flex-col md:flex-row gap-6 items-end shadow-sm">
                                <div className="space-y-1.5 flex-1">
                                    <label className="text-xs font-bold text-theme-text-muted uppercase font-mono">
                                        Departure ICAO
                                    </label>
                                    <input
                                        type="text"
                                        value={depIcao}
                                        onChange={(e) => setDepIcao(e.target.value.toUpperCase())}
                                        className="w-full bg-theme-bg border border-theme-border text-theme-text-dark px-4 py-2 rounded text-xs font-mono focus:outline-none focus:border-theme-brand"
                                    />
                                </div>

                                <div className="space-y-1.5 flex-1">
                                    <label className="text-xs font-bold text-theme-text-muted uppercase font-mono">
                                        Arrival ICAO
                                    </label>
                                    <input
                                        type="text"
                                        value={arrIcao}
                                        onChange={(e) => setArrIcao(e.target.value.toUpperCase())}
                                        className="w-full bg-theme-bg border border-theme-border text-theme-text-dark px-4 py-2 rounded text-xs font-mono focus:outline-none focus:border-theme-brand"
                                    />
                                </div>

                                <button
                                    onClick={() => setMetarParsed(true)}
                                    className="px-6 py-2 bg-theme-brand hover:bg-theme-brand/90 text-white rounded font-bold text-xs shadow-sm transition-all"
                                >
                                    Generate Briefing Pack
                                </button>
                            </div>

                            {/* Briefing details columns */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Weather parser & NOTAM feed */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Weather Parser Widget */}
                                    <div className="bg-theme-card border border-theme-border rounded p-6 space-y-4 shadow-sm">
                                        <div className="flex justify-between items-center border-b border-theme-border pb-3">
                                            <h3 className="font-bold text-theme-text-dark text-sm">
                                                Aviation METAR Parser
                                            </h3>
                                            <span className="text-xs text-theme-text-muted font-mono">
                                                Source: NOAA Aviation Feed
                                            </span>
                                        </div>

                                        <div className="p-4 bg-theme-bg border border-theme-border rounded font-mono text-xs text-theme-text-main space-y-2">
                                            <div className="text-theme-text-muted uppercase font-bold">
                                                RAW TELETYPE:
                                            </div>
                                            <div className="text-theme-brand font-bold">
                                                {rawMetar}
                                            </div>
                                        </div>

                                        {metarParsed ? (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="p-4 bg-theme-extra-light border border-theme-border rounded text-center">
                                                    <span className="text-xs text-theme-text-muted uppercase font-mono">
                                                        WIND PROFILE
                                                    </span>
                                                    <div className="text-xs font-bold text-theme-text-dark mt-1">
                                                        240° at 12 Kts
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-theme-extra-light border border-theme-border rounded text-center">
                                                    <span className="text-xs text-theme-text-muted uppercase font-mono">
                                                        VISIBILITY
                                                    </span>
                                                    <div className="text-xs font-bold text-theme-text-dark mt-1">
                                                        10 KM+ (9999)
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-theme-extra-light border border-theme-border rounded text-center">
                                                    <span className="text-xs text-theme-text-muted uppercase font-mono">
                                                        CLOUDBASE
                                                    </span>
                                                    <div className="text-xs font-bold text-theme-text-dark mt-1">
                                                        Few 2500ft
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-theme-extra-light border border-theme-border rounded text-center">
                                                    <span className="text-xs text-theme-text-muted uppercase font-mono">
                                                        ALTIMETER
                                                    </span>
                                                    <div className="text-xs font-bold text-theme-text-dark mt-1">
                                                        1013 QNH
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center text-xs text-theme-text-muted font-sans border border-theme-border border-dashed rounded">
                                                Click "Generate Briefing Pack" above to parse
                                                meteorological conditions.
                                            </div>
                                        )}
                                    </div>

                                    {/* NOTAM Filter Engine */}
                                    <div className="bg-theme-card border border-theme-border rounded p-6 space-y-4 shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-theme-text-dark text-sm">
                                                Digital NOTAMs
                                            </h3>
                                            <div className="flex gap-1.5">
                                                {[
                                                    { id: 'all', label: 'All' },
                                                    { id: 'rwy', label: 'Runways' },
                                                    { id: 'navaid', label: 'NAVAIDs' },
                                                    { id: 'tfr', label: 'TFRs' },
                                                ].map((btn) => (
                                                    <button
                                                        key={btn.id}
                                                        onClick={() =>
                                                            setNotamFilter(
                                                                btn.id as
                                                                    | 'all'
                                                                    | 'rwy'
                                                                    | 'navaid'
                                                                    | 'tfr'
                                                            )
                                                        }
                                                        className={`px-3 py-1 rounded border text-xs font-semibold transition-all ${
                                                            notamFilter === btn.id
                                                                ? 'bg-theme-info-light text-theme-info border-theme-border-soft'
                                                                : 'bg-theme-card text-theme-text-muted border-theme-border hover:text-theme-text-main'
                                                        }`}
                                                    >
                                                        {btn.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3 font-mono text-xs">
                                            {filteredNotams.map((notam) => (
                                                <div
                                                    key={notam.id}
                                                    className="p-4 bg-theme-extra-light border border-theme-border rounded flex items-start gap-4 hover:border-slate-400 transition-all"
                                                >
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-xs font-extrabold uppercase shrink-0 mt-0.5 ${
                                                            notam.level === 'HIGH'
                                                                ? 'bg-theme-error-light text-theme-error border border-theme-error'
                                                                : notam.level === 'MEDIUM'
                                                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                  : 'bg-theme-bg text-theme-text-muted border border-theme-border'
                                                        }`}
                                                    >
                                                        {notam.level}
                                                    </span>
                                                    <div className="space-y-1">
                                                        <div className="text-theme-text-dark font-bold">
                                                            {notam.id}
                                                        </div>
                                                        <p className="text-xs text-theme-text-main font-sans leading-normal">
                                                            {notam.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Pre-flight Threat Matrix */}
                                <div className="space-y-6">
                                    <div className="bg-theme-card border border-theme-border rounded p-6 space-y-4 shadow-sm">
                                        <h3 className="font-bold text-theme-text-dark text-sm font-semibold">
                                            Threat & Error Management (TEM)
                                        </h3>
                                        <p className="text-xs text-theme-text-muted leading-relaxed">
                                            Evaluate active flight hazards before flight release.
                                            Confirm mitigating actions:
                                        </p>

                                        <div className="space-y-3 text-xs">
                                            {[
                                                {
                                                    id: 'shortRwy',
                                                    label: 'Destination Runway Limitations',
                                                    desc: 'Short runway checks completed',
                                                },
                                                {
                                                    id: 'convectiveWeather',
                                                    label: 'Convective Weather Outlook',
                                                    desc: 'Monitored convective build-up along route',
                                                },
                                                {
                                                    id: 'complexTaxi',
                                                    label: 'Complex Airport Taxi Routing',
                                                    desc: 'Reviewed airport hotspots chart',
                                                },
                                                {
                                                    id: 'pilotFatigue',
                                                    label: 'Crew Fatigue Assessment',
                                                    desc: 'Confirmed pilot fitness (IMSFE)',
                                                },
                                            ].map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() =>
                                                        setTemChecks((prev) => ({
                                                            ...prev,
                                                            [item.id]:
                                                                !prev[item.id as keyof typeof prev],
                                                        }))
                                                    }
                                                    className={`w-full p-4 border rounded text-left flex items-start gap-3 transition-all ${
                                                        temChecks[item.id as keyof typeof temChecks]
                                                            ? 'border-theme-success bg-theme-success-light text-theme-text-main'
                                                            : 'border-theme-border bg-theme-card text-theme-text-muted hover:border-slate-400'
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                                            temChecks[
                                                                item.id as keyof typeof temChecks
                                                            ]
                                                                ? 'bg-theme-success border-theme-success text-white'
                                                                : 'border-theme-border bg-theme-card'
                                                        }`}
                                                    >
                                                        {temChecks[
                                                            item.id as keyof typeof temChecks
                                                        ] && '✓'}
                                                    </span>
                                                    <div>
                                                        <div className="font-bold text-theme-text-dark">
                                                            {item.label}
                                                        </div>
                                                        <div className="text-xs text-theme-text-muted mt-0.5 font-semibold">
                                                            {item.desc}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
