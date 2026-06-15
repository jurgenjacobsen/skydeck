import {
    ChevronRight,
    Grid2x2,
    LayoutList,
    Flag,
    X,
    RotateCcw,
    Award,
    HelpCircle,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

type Question = {
    id: number;
    question: string;
    options: string[];
    answer: number;
};

export default function QBank() {
    const tabs = [
        { name: 'Subjects', value: 'subjects' },
        { name: 'Profile', value: 'profile' },
    ];
    type Tab = typeof tabs[number]['value'];
    const [tab, setTab] = useState<Tab>(tabs[0].value);
    const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
    const [subjectDisplayMode, setSubjectDisplayMode] = useState<'list' | 'grid'>(localStorage.getItem('subjectDisplayMode') as 'list' | 'grid' || 'list');

    const handleSubjectDisplayChange = (mode: 'list' | 'grid') => {
        if (mode === subjectDisplayMode) return;
        localStorage.setItem('subjectDisplayMode', mode);
        setSubjectDisplayMode(mode);
    };

    const subjects = [
        { n: '010', name: 'Air Law', count: 1200 },
        { n: '021', name: 'Aircraft General Knowledge', count: 900 },
        { n: '022', name: 'Instrumentation', count: 1200 },
        { n: '031', name: 'Mass and Balance', count: 1200 },
        { n: '032', name: 'Performance', count: 750 },
        { n: '033', name: 'Flight Planning and Monitoring', count: 750 },
        { n: '040', name: 'Human Performance and Limitations', count: 600 },
        { n: '050', name: 'Meteorology', count: 850 },
        { n: '061', name: 'General Navigation', count: 850 },
        { n: '062', name: 'Radio Navigation', count: 850 },
        { n: '070', name: 'Operational Procedures', count: 400 },
        { n: '081', name: 'Principles of Flight', count: 300 },
        { n: '090', name: 'Communications', count: 450 },
    ].sort((a, b) => a.name.localeCompare(b.name));

    // Exercise states
    const [exerciseMode, setExerciseMode] = useState<'exam' | 'practice' | null>(null);
    const exerciseTabs = [
        { name: 'Questions', value: 'questions' },
        { name: 'Results', value: 'results' },
    ];
    type ExerciseTab = typeof exerciseTabs[number]['value'];
    const [exerciseTab, setExerciseTab] = useState<ExerciseTab>(exerciseTabs[0].value);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
    const [submitted, setSubmitted] = useState<boolean[]>(Array(10).fill(false));
    const [flagged, setFlagged] = useState<boolean[]>(Array(10).fill(false));
    const [isExamFinished, setIsExamFinished] = useState(false);

    const explanationsPool = [
        "ICAO Annex 11 and standard SOPs dictate that in case of double-way communication failure under IFR, a pilot must squawk 7600 and follow predetermined procedures based on VMC or IMC conditions.",
        "V1 is the takeoff decision speed. Once V1 is reached, takeoff must be continued in the event of an engine failure since the aircraft can no longer stop within the remaining runway length.",
        "Structural icing occurs when visible moisture (water droplets) falls on surfaces whose temperature is at or below 0°C. Supercooled water droplets are highly unstable and freeze immediately on contact.",
        "As altitude increases, air density decreases. Since indicated airspeed is a function of dynamic pressure, to maintain a constant dynamic pressure (constant IAS) in less dense air, the aircraft must fly faster through the air (higher TAS).",
        "Contingency fuel is required by regulations to account for unexpected factors like headwind increases, minor routing deviations, or atmospheric temperature shifts from forecast data.",
        "Class A, B, C, and D airspaces are controlled airspaces where continuous two-way communication is mandatory for all aircraft operating within them.",
        "Deflecting the left aileron up (left wing down) counters the lifting force of the crosswind on the left wing, keeping the aircraft stable, while right rudder maintains directional tracking along the runway centerline.",
        "EASA Part-FCL regulations specify that all theoretical exams must be successfully passed within a period of 18 months from the end of the calendar month when the applicant first sat for an exam.",
        "In a T-tail configuration, the elevator is mounted high. At extreme angles of attack (stall), the turbulent wake from the stalled main wing flows directly over the tailplane, rendering the pitch controls ineffective.",
        "Rain on the windshield creates a refractive water film that bends light rays downward, causing the runway to appear lower (and therefore the pilot to feel higher and further away) than it actually is."
    ];

    function loadExercise(mode: 'exam' | 'practice') {
        setExerciseMode(mode);
        setIsExamFinished(false);
        setExerciseTab('questions');

        const generated: Question[] = [];
        const subjectName = selectedSubject !== null ? subjects[selectedSubject].name : 'General';

        const questionPool = [
            `Which of the following describes the correct procedures to follow in case of a communication failure?`,
            `What is the definition of V1 speed during takeoff?`,
            `Under what meteorological conditions is structural icing most likely to occur?`,
            `How does an increase in altitude affect the true airspeed (TAS) at a constant indicated airspeed (IAS)?`,
            `What is the primary purpose of the contingency fuel reserve in flight planning?`,
            `Which airspace classification requires mandatory radio contact and continuous two-way communication?`,
            `How should the pilot compensate for a crosswind from the left during the takeoff roll?`,
            `Which statement is correct regarding the validity period of theoretical knowledge exams?`,
            `What is the principal danger of a deep stall condition in a T-tail aircraft?`,
            `What is the effect of rain on a windshield in terms of the pilot's visual perception of the runway?`
        ];

        const optionsPool = [
            [
                'Maintain last assigned speed and level for 20 minutes, then adjust to filed flight plan.',
                'Squawk 7600, maintain route and altitude according to regional rules, and land at the nearest suitable airport.',
                'Immediately descend to VFR altitude and search for an emergency landing strip.',
                'Activate TCAS audio alerts and perform immediate right turns to clear air lanes.'
            ],
            [
                'The maximum speed during takeoff at which the pilot can safely abort the flight.',
                'Takeoff decision speed, after which takeoff must be continued even if an engine fails.',
                'Minimum control speed in the air, ensuring directional control is maintained.',
                'Design maneuvering speed, representing the limit for structural loads.'
            ],
            [
                'High relative humidity, temperature between -10°C and 0°C, in stratiform clouds.',
                'Visible moisture, temperature between 0°C and -10°C, with large supercooled water droplets.',
                'Dry air, temperature below -20°C, in clear air turbulence.',
                'High pressure area, temperature between +2°C and +10°C, near frontal zones.'
            ],
            [
                'TAS decreases because air density decreases.',
                'TAS increases because air density decreases.',
                'TAS remains constant regardless of air density variations.',
                'TAS fluctuations depend exclusively on wind shear profiles.'
            ],
            [
                'To allow for taxiing delays at the departure aerodrome.',
                'To compensate for unforeseen factors such as routing changes or meteorological shifts.',
                'To provide fuel for holding at the destination airport for exactly 45 minutes.',
                'To meet the minimum landing weight requirements of structural regulations.'
            ],
            [
                'Class G airspace below transition altitude.',
                'Class A, B, C and D airspaces.',
                'Only Class A airspace under instrument flight rules.',
                'Airspaces designated strictly as restricted or prohibited zones.'
            ],
            [
                'Apply right rudder and neutral ailerons.',
                'Deflect left aileron fully into the wind (left wing down) and apply right rudder for tracking.',
                'Apply right aileron (right wing down) and maintain neutral rudder.',
                'Deflect both ailerons to neutral and use asymmetric braking.'
            ],
            [
                '12 months from the date of the first successful examination attempt.',
                '36 months from the date of successfully passing all required theoretical subjects.',
                '24 months from the end of the calendar month of the last examination session.',
                'Indefinite, provided the pilot holds a valid medical certificate.'
            ],
            [
                'The turbulent air from the stalled wing blankets the elevator, making pitch recovery impossible.',
                'The engine compressor stalls due to disturbed air intake flow.',
                'The wing stalls starting from the tips, causing abrupt roll control loss.',
                'The landing gear doors open automatically due to aerodynamic load changes.'
            ],
            [
                'The runway appears closer and lower than it actually is.',
                'The runway appears further away and higher than it actually is.',
                'The runway appears lower and further away than it actually is.',
                'The runway appears higher and closer than it actually is.'
            ]
        ];

        const answersPool = [1, 1, 1, 1, 1, 1, 1, 2, 0, 1]; // Answer indices (0-3)

        for (let i = 0; i < 10; i++) {
            generated.push({
                id: 10000 + Math.floor(Math.random() * 90000),
                question: `${questionPool[i]}`,
                options: optionsPool[i],
                answer: answersPool[i],
            });
        }

        setQuestions(generated);
        setCurrentQuestionIndex(0);
        setAnswers(Array(10).fill(null));
        setSubmitted(Array(10).fill(false));
        setFlagged(Array(10).fill(false));
    }

    const selectOption = (optIdx: number) => {
        if (submitted[currentQuestionIndex] || isExamFinished) return;
        const nextAnswers = [...answers];
        nextAnswers[currentQuestionIndex] = optIdx;
        setAnswers(nextAnswers);
    };

    const submitAnswer = () => {
        const nextSubmitted = [...submitted];
        nextSubmitted[currentQuestionIndex] = true;
        setSubmitted(nextSubmitted);
    };

    const resetQuestion = () => {
        const nextAnswers = [...answers];
        nextAnswers[currentQuestionIndex] = null;
        setAnswers(nextAnswers);
        const nextSubmitted = [...submitted];
        nextSubmitted[currentQuestionIndex] = false;
        setSubmitted(nextSubmitted);
    };

    const toggleFlag = () => {
        const nextFlagged = [...flagged];
        nextFlagged[currentQuestionIndex] = !nextFlagged[currentQuestionIndex];
        setFlagged(nextFlagged);
    };

    const finishExercise = () => {
        setIsExamFinished(true);
        setExerciseTab('results');
    };

    // Score Calculations
    const correctCount = questions.reduce((acc, q, idx) => {
        return acc + (answers[idx] === q.answer ? 1 : 0);
    }, 0);
    const scorePercentage = Math.round((correctCount / 10) * 100);
    const hasPassed = scorePercentage >= 75;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <>
            <div>
                <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                    Question Bank
                </h1>
                <p className="text-theme-text-main text-xs mt-1">
                    Browse and search through our comprehensive question bank.
                </p>
            </div>

            { exerciseMode === null ? <>
                {/* Q-Bank Navigation Sub-Tabs */}
                <div className="flex border-b border-theme-border text-xs my-4">
                    {
                        tabs.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => setTab(t.value)}
                                className={`px-6 py-3 border-b-2 font-semibold text-xs transition-all ${
                                    tab === t.value
                                        ? 'border-theme-brand text-theme-brand'
                                        : 'border-transparent text-theme-text-muted hover:text-theme-text-main cursor-pointer'
                                }`}
                            >
                                {t.name}
                            </button>
                        ))
                    }
                </div>

                {/* Tab Content */}
                {tab === 'subjects' && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-theme-card border border-theme-border rounded p-6 shadow col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <h3 className="font-bold text-theme-text-dark text-base">
                                        Available Subjects
                                    </h3>
                                    <div className="flex items-center px-4 border-l border-theme-border ml-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleSubjectDisplayChange('list')}
                                                className={`cursor-pointer ${
                                                    subjectDisplayMode === 'list'
                                                        ? 'bg-theme-card text-theme-brand font-semibold'
                                                        : 'text-theme-text-muted hover:text-theme-text-main'
                                                }`}
                                                title="List View"
                                            >
                                                <LayoutList className="w-4 h-4"/>
                                            </button>
                                            <button
                                                onClick={() => handleSubjectDisplayChange('grid')}
                                                className={`cursor-pointer ${
                                                    subjectDisplayMode === 'grid'
                                                        ? 'text-theme-brand font-semibold'
                                                        : 'text-theme-text-muted hover:text-theme-text-main'
                                                }`}
                                                title="Grid View"
                                            >
                                                <Grid2x2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                        {selectedSubject !== null && (
                                            <span
                                                className="text-theme-brand cursor-pointer font-medium text-xs ml-4 hover:text-theme-brand-light transition-colors"
                                                onClick={() => setSelectedSubject(null)}>
                                                Clear Selection
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs text-theme-text-muted font-mono">
                                    {subjects.reduce((sum, s) => sum + s.count, 0).toLocaleString()} Questions
                                </span>
                            </div>
                            <div className={`grid gap-2 ${subjectDisplayMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {subjects.map((subject, i) => (
                                    <div
                                        key={subject.name}
                                        className="border border-theme-border rounded"
                                    >
                                        <button
                                            className="w-full flex justify-between items-center px-4 py-3 cursor-pointer group"
                                            onClick={() => {
                                                if (selectedSubject === i) {
                                                    setSelectedSubject(null);
                                                } else {
                                                    setSelectedSubject(i);
                                                }
                                            }}>
                                            <div className="flex items-center space-x-2">
                                                {selectedSubject === i && (
                                                    <ChevronRight className={`h-4 w-4 text-theme-brand`} />
                                                )}
                                                <span className="text-sm text-theme-text-main group-hover:text-theme-text-main font-medium">
                                                    {subject.name}
                                                </span>
                                            </div>
                                            <span className="text-xs text-theme-text-muted font-mono">
                                                {subject.count.toLocaleString()} Questions
                                            </span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-theme-card border border-theme-border rounded p-6 shadow col-span-1">
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <h3 className="font-bold text-theme-text-dark text-base">
                                        {selectedSubject !== null ? subjects[selectedSubject]?.name : 'Select a Subject'}
                                    </h3>
                                    <p className="text-theme-text-main text-xs mt-2">
                                        {selectedSubject !== null ? subjects[selectedSubject]?.count : '0'} questions available.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-theme-border text-theme-text-main">
                                        <ul className="list-disc list-inside space-y-4 text-sm">
                                            <li className="flex items-center justify-between">
                                                <span className="font-semibold">Overall Avg. Score</span> <span className="text-theme-brand font-semibold text-lg">85%</span>
                                            </li>
                                            <li className="flex items-center justify-between">
                                                <span className="font-semibold">Personal Avg. Score</span> <span className="text-theme-brand font-semibold text-lg flex items-center gap-1">90%</span>
                                            </li>
                                            <li className="flex items-center justify-between">
                                                <span className="font-semibold">Duration</span> <span className="text-theme-brand font-semibold text-lg">1h30m</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`flex space-x-2 pt-4 border-t border-theme-border ${selectedSubject === null ? 'opacity-50' : ''}`}>
                                    <button
                                        disabled={selectedSubject === null}
                                        onClick={() => loadExercise('exam')}
                                        className={`
                                            w-1/3 bg-theme-brand text-white px-4 py-2 rounded transition-colors text-xs font-semibold
                                            ${selectedSubject === null ? '' : 'hover:bg-theme-brand-light cursor-pointer'}
                                        `}>
                                        Exam Mode
                                    </button>
                                    <button
                                        disabled={selectedSubject === null}
                                        onClick={() => loadExercise('practice')}
                                        className={`
                                            w-2/3 bg-theme-card text-theme-text-main border border-theme-border px-4 py-2 rounded transition-colors text-xs font-semibold
                                            ${selectedSubject === null ? '' : 'hover:bg-theme-hover cursor-pointer'}`
                                        }>
                                        Practice Mode
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'profile' && (
                    <div className="space-y-6">
                        {/* Stats Summary Cards */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-theme-card border border-theme-border rounded p-6 shadow flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">Completed Sessions</span>
                                    <Award className="w-5 h-5 text-theme-brand" />
                                </div>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-theme-text-dark font-mono">14</span>
                                    <span className="text-xs text-theme-text-muted block mt-1">Practice & Exam runs</span>
                                </div>
                            </div>
                            <div className="bg-theme-card border border-theme-border rounded p-6 shadow flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">Average Score</span>
                                    <CheckCircle2 className="w-5 h-5 text-theme-success" />
                                </div>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-theme-text-dark font-mono">88.5%</span>
                                    <span className="text-xs text-theme-text-muted block mt-1">Passing rate: 75%</span>
                                </div>
                            </div>
                            <div className="bg-theme-card border border-theme-border rounded p-6 shadow flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">Study Streak</span>
                                    <span className="text-amber-500 font-bold">🔥 14 days</span>
                                </div>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-theme-text-dark font-mono">14d</span>
                                    <span className="text-xs text-theme-text-muted block mt-1">Daily login requirement met</span>
                                </div>
                            </div>
                            <div className="bg-theme-card border border-theme-border rounded p-6 shadow flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">Total Questions</span>
                                    <HelpCircle className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-theme-text-dark font-mono">140</span>
                                    <span className="text-xs text-theme-text-muted block mt-1">Unique questions solved</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Breakdown section */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-theme-card border border-theme-border rounded p-6 shadow col-span-2">
                                <h3 className="font-bold text-theme-text-dark text-sm mb-4">Performance by Subject</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Air Law', count: 40, progress: 92 },
                                        { name: 'Meteorology', count: 35, progress: 85 },
                                        { name: 'General Navigation', count: 45, progress: 88 },
                                        { name: 'Operational Procedures', count: 20, progress: 95 }
                                    ].map((subj) => (
                                        <div key={subj.name} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-theme-text-dark">{subj.name} ({subj.count} Qs)</span>
                                                <span className="text-theme-brand font-bold">{subj.progress}%</span>
                                            </div>
                                            <div className="w-full bg-theme-bg h-2 rounded-full overflow-hidden">
                                                <div className="bg-theme-brand h-full rounded-full" style={{ width: `${subj.progress}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-theme-card border border-theme-border rounded p-6 shadow col-span-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-theme-text-dark text-sm mb-4">Achievements</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-theme-bg rounded border border-theme-border">
                                            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-full shrink-0">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-theme-text-dark">High Flier</h4>
                                                <p className="text-[10px] text-theme-text-muted">Pass 5 exams in a row</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-theme-bg rounded border border-theme-border">
                                            <div className="p-2 bg-theme-brand/10 text-theme-brand rounded-full shrink-0">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-theme-text-dark">Night Owl</h4>
                                                <p className="text-[10px] text-theme-text-muted">Study past 11:00 PM UTC</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-theme-border text-center text-[10px] text-theme-text-muted mt-4">
                                    Last sync: 2 minutes ago
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </> : <>
                {/* Exercise Navigation Sub-Tabs */}
                <div className="flex border-b border-theme-border text-xs my-4">
                    {
                        exerciseTabs.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => setExerciseTab(t.value)}
                                className={`px-6 py-3 border-b-2 font-semibold text-xs transition-all ${
                                    exerciseTab === t.value
                                        ? 'border-theme-brand text-theme-brand'
                                        : 'border-transparent text-theme-text-muted hover:text-theme-text-main cursor-pointer'
                                }`}
                            >
                                {t.name}
                            </button>
                        ))
                    }
                </div>

                { exerciseTab === 'questions' && currentQuestion && (
                    <div className="grid grid-cols-3 gap-4">
                        {/* Question Details Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-theme-card border border-theme-border rounded p-6 space-y-6 shadow">
                                {/* Header bar */}
                                <div className="flex justify-between items-center text-xs font-mono border-b border-theme-border pb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-theme-brand font-bold">QUESTION {currentQuestion.id}</span>
                                        <span className="text-slate-300">|</span>
                                        <span className="text-theme-text-main">
                                            Subject {selectedSubject !== null ? subjects[selectedSubject].n : 'General'} {selectedSubject !== null ? subjects[selectedSubject].name : ''}
                                        </span>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-theme-extra-light text-theme-text-muted font-semibold">
                                        ECQB LO: {selectedSubject !== null ? subjects[selectedSubject].n : '000'}.02.01
                                    </span>
                                </div>

                                {/* Question text */}
                                <div className="text-theme-text-main text-xs leading-relaxed">
                                    <div className="font-bold text-theme-text-dark text-sm mb-4">
                                        {currentQuestion.question}
                                    </div>
                                </div>

                                {/* Options list */}
                                <div className="space-y-3">
                                    {currentQuestion.options.map((optText, optIdx) => {
                                        const letter = ['A', 'B', 'C', 'D'][optIdx];
                                        const isSelected = answers[currentQuestionIndex] === optIdx;
                                        const isCorrect = optIdx === currentQuestion.answer;
                                        const isQSubmitted = submitted[currentQuestionIndex] || isExamFinished;

                                        let btnStyle = 'border-theme-border bg-theme-card text-theme-text-main hover:border-slate-400 hover:bg-theme-bg';

                                        if (isSelected) {
                                            btnStyle = 'border-theme-brand bg-theme-info-light text-theme-brand';
                                        }

                                        if (isQSubmitted) {
                                            if (isCorrect) {
                                                btnStyle = 'border-theme-success bg-theme-success-light text-theme-success font-semibold';
                                            } else if (isSelected) {
                                                btnStyle = 'border-theme-error bg-theme-error-light text-theme-error font-semibold';
                                            } else {
                                                btnStyle = 'border-theme-border bg-theme-card text-theme-text-muted pointer-events-none opacity-60';
                                            }
                                        }

                                        return (
                                            <button
                                                key={optIdx}
                                                disabled={isQSubmitted}
                                                onClick={() => selectOption(optIdx)}
                                                className={`w-full flex items-center gap-4 p-4 rounded border text-left text-xs transition-all cursor-pointer ${btnStyle}`}
                                            >
                                                <span className={`w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                                                    isQSubmitted && isCorrect ? 'bg-theme-success text-white font-bold' :
                                                    isQSubmitted && isSelected ? 'bg-theme-error text-white font-bold' : 'bg-theme-bg'
                                                }`}>
                                                    {letter}
                                                </span>
                                                <span className="flex-1">{optText}</span>
                                                {isQSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-theme-success shrink-0" />}
                                                {isQSubmitted && isSelected && !isCorrect && <X className="w-5 h-5 text-theme-error shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Explanation box */}
                                {((exerciseMode === 'practice' && submitted[currentQuestionIndex]) || isExamFinished) && (
                                    <div className="p-4 bg-theme-info-light/20 border border-theme-info-light/50 rounded space-y-2">
                                        <h4 className="font-bold text-theme-brand text-xs">Explanation & Learning Objective</h4>
                                        <p className="text-theme-text-main text-xs leading-relaxed">
                                            {explanationsPool[currentQuestionIndex]}
                                        </p>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex justify-between items-center border-t border-theme-border pt-6">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={toggleFlag}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-all cursor-pointer ${
                                                flagged[currentQuestionIndex]
                                                    ? 'border-amber-500 bg-amber-500/10 text-amber-600'
                                                    : 'border-theme-border text-theme-text-muted hover:text-theme-text-main'
                                            }`}
                                        >
                                            <Flag className="w-3.5 h-3.5" />
                                            <span>{flagged[currentQuestionIndex] ? 'Flagged' : 'Flag for Review'}</span>
                                        </button>
                                        {(exerciseMode === 'practice' && !isExamFinished) && (
                                            <button
                                                onClick={resetQuestion}
                                                disabled={!submitted[currentQuestionIndex]}
                                                className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition-all border border-theme-border text-theme-text-muted hover:text-theme-text-main cursor-pointer disabled:opacity-50 disabled:pointer-events-none`}
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                <span>Reset</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            disabled={currentQuestionIndex === 0}
                                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                            className="px-3 py-1.5 rounded border border-theme-border text-xs font-semibold text-theme-text-main hover:bg-theme-bg cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            Previous
                                        </button>

                                        {exerciseMode === 'practice' && !submitted[currentQuestionIndex] && !isExamFinished ? (
                                            <button
                                                disabled={answers[currentQuestionIndex] === null}
                                                onClick={submitAnswer}
                                                className={`px-5 py-1.5 rounded text-xs font-bold transition-all ${
                                                    answers[currentQuestionIndex] === null
                                                        ? 'bg-theme-bg text-theme-text-muted cursor-not-allowed'
                                                        : 'bg-theme-brand text-white hover:bg-theme-brand/90 shadow cursor-pointer'
                                                }`}
                                            >
                                                Submit Answer
                                            </button>
                                        ) : (
                                            <button
                                                disabled={currentQuestionIndex === 9}
                                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                                className="px-5 py-1.5 rounded bg-theme-brand text-white text-xs font-bold hover:bg-theme-brand/90 shadow cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigator Panel Column */}
                        <div className="col-span-1 space-y-6">
                            <div className="bg-theme-card border border-theme-border rounded p-6 shadow space-y-6">
                                <h3 className="font-bold text-theme-text-dark text-sm">
                                    Navigator
                                </h3>

                                <div className="grid grid-cols-10 gap-2 mt-4">
                                    {questions.map((_, idx) => {
                                        const isSelected = idx === currentQuestionIndex;
                                        const isAnswered = answers[idx] !== null;
                                        const isFlagged = flagged[idx];

                                        let btnClass = "w-10 h-10 rounded border flex items-center justify-center font-semibold text-xs transition-colors cursor-pointer ";

                                        if (isSelected) {
                                            btnClass += "border-theme-brand bg-theme-brand/5 text-theme-brand font-bold";
                                        } else if (isAnswered) {
                                            btnClass += "border-theme-border bg-theme-extra-light text-theme-text-dark";
                                        } else {
                                            btnClass += "border-theme-border bg-theme-card text-theme-text-muted hover:bg-theme-bg";
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentQuestionIndex(idx)}
                                                className={btnClass + " relative"}
                                            >
                                                {idx + 1}
                                                {isFlagged && (
                                                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" title="Flagged" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="text-xs space-y-2 border-t border-theme-border pt-4">
                                    <div className="flex justify-between items-center text-theme-text-main">
                                        <span>Completed</span>
                                        <span className="font-semibold">{answers.filter(a => a !== null).length} / 10</span>
                                    </div>
                                    <div className="flex justify-between items-center text-theme-text-main">
                                        <span>Flagged for Review</span>
                                        <span className="font-semibold">{flagged.filter(f => f).length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-theme-text-main">
                                        <span>Session Mode</span>
                                        <span className="font-semibold capitalize">{exerciseMode}</span>
                                    </div>
                                </div>

                                <div className="border-t border-theme-border pt-4 flex flex-col gap-2">
                                    <button
                                        onClick={finishExercise}
                                        className="w-full bg-theme-brand text-white px-4 py-2 rounded font-semibold text-xs hover:bg-theme-brand-light cursor-pointer text-center"
                                    >
                                        Finish Session
                                    </button>
                                    <button
                                        onClick={() => setExerciseMode(null)}
                                        className="w-full bg-theme-card text-theme-text-main border border-theme-border px-4 py-2 rounded text-xs font-semibold hover:bg-theme-bg cursor-pointer text-center"
                                    >
                                        Cancel Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                { exerciseTab === 'results' && (
                    <div className="space-y-6">
                        {/* Results Summary Box */}
                        <div className="bg-theme-card border border-theme-border rounded p-6 shadow grid grid-cols-3 gap-6 items-center">
                            <div className="col-span-1 flex flex-col items-center justify-center border-r border-theme-border py-4">
                                <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 ${
                                    hasPassed ? 'border-theme-success bg-theme-success-light/10 text-theme-success' : 'border-theme-error bg-theme-error-light/10 text-theme-error'
                                }`}>
                                    <span className="text-3xl font-extrabold font-mono">{scorePercentage}%</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Score</span>
                                </div>
                                <div className={`mt-3 px-3 py-1 rounded text-xs font-bold ${
                                    hasPassed ? 'bg-theme-success-light text-theme-success' : 'bg-theme-error-light text-theme-error'
                                }`}>
                                    {hasPassed ? 'PASSED (>=75%)' : 'FAILED (<75%)'}
                                </div>
                            </div>

                            <div className="col-span-2 space-y-4 pl-4">
                                <h3 className="font-bold text-theme-text-dark text-base">
                                    Session Performance Breakdown
                                </h3>
                                <p className="text-theme-text-main text-xs leading-relaxed">
                                    You have completed a 10-question evaluation in <span className="font-semibold capitalize">{exerciseMode} mode</span> for the subject <span className="font-semibold">{selectedSubject !== null ? subjects[selectedSubject].name : 'General'}</span>.
                                </p>

                                <div className="grid grid-cols-3 gap-4 text-xs">
                                    <div className="p-3 bg-theme-bg rounded border border-theme-border">
                                        <span className="text-theme-text-muted block font-medium">Correct</span>
                                        <span className="text-lg font-bold text-theme-success font-mono">{correctCount} / 10</span>
                                    </div>
                                    <div className="p-3 bg-theme-bg rounded border border-theme-border">
                                        <span className="text-theme-text-muted block font-medium">Incorrect</span>
                                        <span className="text-lg font-bold text-theme-error font-mono">{10 - correctCount} / 10</span>
                                    </div>
                                    <div className="p-3 bg-theme-bg rounded border border-theme-border">
                                        <span className="text-theme-text-muted block font-medium">Flagged</span>
                                        <span className="text-lg font-bold text-amber-500 font-mono">{flagged.filter(f => f).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Question Breakdown List */}
                        <div className="bg-theme-card border border-theme-border rounded p-6 shadow space-y-4">
                            <h3 className="font-bold text-theme-text-dark text-sm">
                                Question-by-Question Review
                            </h3>

                            <div className="divide-y divide-theme-border-soft">
                                {questions.map((q, idx) => {
                                    const userAns = answers[idx];
                                    const isCorrect = userAns === q.answer;
                                    const optionLetters = ['A', 'B', 'C', 'D'];

                                    return (
                                        <div key={idx} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <span className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs ${
                                                    userAns === null ? 'border-theme-border bg-theme-bg text-theme-text-muted' :
                                                    isCorrect ? 'border-theme-success bg-theme-success-light text-theme-success' : 'border-theme-error bg-theme-error-light text-theme-error'
                                                }`}>
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <span className="font-bold text-theme-text-dark text-xs block">QUESTION {q.id}</span>
                                                    <span className="text-[11px] text-theme-text-muted truncate max-w-lg block">
                                                        {q.question}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 text-xs">
                                                <div className="flex gap-4">
                                                    <div>
                                                        <span className="text-theme-text-muted text-[10px] block font-medium">Your Answer</span>
                                                        <span className={`font-bold font-mono ${
                                                            userAns === null ? 'text-theme-text-muted' : isCorrect ? 'text-theme-success' : 'text-theme-error'
                                                        }`}>
                                                            {userAns !== null ? optionLetters[userAns] : 'None'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-theme-text-muted text-[10px] block font-medium">Correct Answer</span>
                                                        <span className="font-bold text-theme-success font-mono">
                                                            {optionLetters[q.answer]}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setCurrentQuestionIndex(idx);
                                                        setExerciseTab('questions');
                                                    }}
                                                    className="px-3 py-1.5 bg-theme-bg border border-theme-border text-theme-text-dark rounded text-xs font-semibold hover:bg-theme-border transition-colors cursor-pointer"
                                                >
                                                    Review
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setExerciseMode(null)}
                                className="px-4 py-2 border border-theme-border text-theme-text-main rounded text-xs font-bold hover:bg-theme-bg cursor-pointer"
                            >
                                Back to Subject List
                            </button>
                            <button
                                onClick={() => loadExercise(exerciseMode || 'practice')}
                                className="px-4 py-2 bg-theme-brand text-white rounded text-xs font-bold hover:bg-theme-brand-light cursor-pointer"
                            >
                                Retake Session
                            </button>
                        </div>
                    </div>
                )}
            </>}
        </>
    );
}