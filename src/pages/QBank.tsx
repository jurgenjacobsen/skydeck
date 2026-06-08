import { useState } from 'react';
import { Flame, Calculator, Check } from 'lucide-react';

interface QBankProps {
    qStreak: number;
}

const QBank: React.FC<QBankProps> = ({ qStreak }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [qSubmitted, setQSubmitted] = useState(false);
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

    return (
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
                        <span className="text-xs text-theme-text-muted">Streak:</span>
                        <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                            <Flame className="w-4 h-4 fill-amber-500 stroke-none" /> {qStreak} Days
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
                                <span className="text-theme-brand font-bold">QUESTION 10243</span>
                                <span className="text-slate-300">|</span>
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
                            A flight is planned from London to Paris. The flight planning data
                            shows:
                            <div className="mt-3 p-4 bg-theme-extra-light border border-theme-border rounded font-mono text-xs space-y-1 text-theme-text-dark">
                                <div>True Heading (TH) = 095°</div>
                                <div>Magnetic Variation (Var) = 7° West</div>
                                <div>Compass Deviation (Dev) = 2° East</div>
                            </div>
                            <div className="mt-4 font-bold text-theme-text-dark">
                                What is the corresponding Compass Heading (CH) for this flight
                                stage?
                            </div>
                        </div>

                        {/* Options list */}
                        <div className="space-y-3">
                            {[
                                { id: 'A', text: '104° (Applied deviation incorrectly)' },
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
                                <Check className="w-5 h-5 text-theme-success" />
                                <h3 className="font-bold text-theme-text-dark text-sm">
                                    CFI Explanation Verified
                                </h3>
                            </div>
                            <p className="text-xs text-theme-text-main leading-relaxed">
                                To calculate Compass Heading (CH) from True Heading (TH), we follow
                                the standard navigation formula step-by-step:
                            </p>
                            <div className="p-4 bg-theme-extra-light border border-theme-border rounded font-mono text-xs text-theme-text-dark space-y-2">
                                <div>1. Convert True Heading to Magnetic Heading (MH):</div>
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
                                    2. Convert Magnetic Heading to Compass Heading (CH):
                                </div>
                                <div className="text-theme-brand pl-4 font-bold">
                                    CH = MH ± Deviation
                                </div>
                                <div className="text-theme-text-muted pl-4 font-sans">
                                    Since Deviation is East (2°E), we SUBTRACT Deviation:
                                </div>
                                <div className="text-theme-brand pl-4 font-bold">
                                    CH = 102° - 2° = 100° Compass
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: E6B Calculator Sandbox */}
                <div className="space-y-6">
                    <div className="bg-theme-card border border-theme-border rounded p-6 space-y-6 shadow-sm">
                        <div className="flex items-center gap-2.5 border-b border-theme-border pb-4">
                            <Calculator className="w-5 h-5 text-theme-brand" />
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
                                    onChange={(e) => setWindSpeed(Number(e.target.value))}
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
                                    onChange={(e) => setWindDir(Number(e.target.value))}
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
                                    onChange={(e) => setTrueCourse(Number(e.target.value))}
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
                                    onChange={(e) => setTrueAirspeed(Number(e.target.value))}
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
                                    {Math.abs(crosswind)} KTS {crosswind > 0 ? 'R' : 'L'}
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
    );
};

export default QBank;
