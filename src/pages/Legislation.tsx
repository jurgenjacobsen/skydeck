import React, { useState } from 'react';

interface WikiProps {
    searchQuery: string;
}

const Wiki: React.FC<WikiProps> = ({ searchQuery }) => {
    const [wikiSearch, setWikiSearch] = useState('');
    const [wikiTab, setWikiTab] = useState<'airspace' | 'fuel' | 'medical'>('airspace');
    const [medicalAge, setMedicalAge] = useState<'under40' | '40to50' | 'over50'>('under40');
    const [medicalClass, setMedicalClass] = useState<'class1' | 'class2' | 'lapl'>('class1');

    // Combined search queries
    const activeSearch = wikiSearch || searchQuery;

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
            reg.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
            reg.desc.toLowerCase().includes(activeSearch.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                    EASA & ICAO Legislation Wiki
                </h1>
                <p className="text-theme-text-main text-xs mt-1">
                    Cross-border aviation legal standards translated to plain English.
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
                                        .filter((reg) => reg.cat === 'airspace')
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
                                                    <span>Reference: Section A.2</span>
                                                    <a
                                                        href="#link"
                                                        onClick={(e) => e.preventDefault()}
                                                        className="text-theme-brand hover:underline"
                                                    >
                                                        Download Official PDF Backlink
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
                                Regulatory harmonization mapping for trans-atlantic operations.
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
                                                Variable (e.g. 3,000ft to 6,000ft based on local
                                                airport authority)
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase font-mono text-theme-text-muted font-bold">
                                                FAA standard
                                            </div>
                                            <div className="text-theme-text-main mt-1">
                                                Fixed at 18,000ft MSL across US airspace
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
                                Under European Commercial Air Transport regulations, the minimum
                                block fuel loaded on board a jet aircraft must follow the structured
                                parameters below to protect against diversion contingencies.
                            </p>

                            <div className="space-y-3 font-mono text-xs">
                                <div className="p-3.5 bg-theme-extra-light border border-theme-border rounded flex justify-between items-center">
                                    <div>
                                        <span className="text-theme-text-dark font-bold">
                                            1. Taxi Fuel
                                        </span>
                                        <div className="text-xs text-theme-text-muted font-sans mt-0.5">
                                            Calculated fuel burn before take-off roll
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
                                            Climb, Cruise, Descent, and Instrument Approach at
                                            destination
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
                                            Higher of 5% of trip fuel OR 3 minutes holding at 1500ft
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
                                            Fuel to execute missed approach at destination, climb,
                                            cruise, and land at alternate
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
                                            Hold for 30 minutes at 1,500ft above alternate airport
                                            elevation
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
                            <h3 className="font-bold text-theme-text-dark text-sm">
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
                                            onClick={() => setMedicalClass('class1')}
                                            className={`py-2 text-xs font-semibold rounded border transition-all ${
                                                medicalClass === 'class1'
                                                    ? 'bg-theme-info-light text-theme-brand border-theme-brand shadow-sm font-semibold'
                                                    : 'bg-theme-card text-theme-text-main border-theme-border hover:text-theme-text-dark'
                                            }`}
                                        >
                                            Class 1
                                        </button>
                                        <button
                                            onClick={() => setMedicalClass('class2')}
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
                            <h3 className="font-bold text-theme-text-dark text-sm">
                                Disqualifying Conditions
                            </h3>
                            <p className="text-xs text-theme-text-muted leading-relaxed">
                                The following medical diagnoses constitute an immediate suspension
                                of flight medical validity under Part-MED.
                            </p>
                            <ul className="space-y-3.5 text-xs text-theme-text-main">
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-theme-error mt-1.5 shrink-0"></span>
                                    <span>
                                        <strong>Cardiac:</strong> Active angina, myocardial
                                        infarction history, or heart valve replacement.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-theme-error mt-1.5 shrink-0"></span>
                                    <span>
                                        <strong>Neurological:</strong> Unexplained loss of
                                        consciousness, epilepsy diagnosis, or recurrent migraine
                                        triggers.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-theme-error mt-1.5 shrink-0"></span>
                                    <span>
                                        <strong>Vision:</strong> Binocular visual acuity less than
                                        6/9 (0.7) in each eye separately or color blindness (Class
                                        1).
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wiki;
