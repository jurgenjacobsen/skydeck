import { ChevronRight, Grid2x2, LayoutList } from 'lucide-react';
import { useState } from 'react';


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

    return (
        <div>
            <div>
                <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                    Question Bank
                </h1>
                <p className="text-theme-text-main text-xs mt-1">
                    Browse and search through our comprehensive question bank.
                </p>
            </div>

            {/* Wiki Navigation Sub-Tabs */}
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
                                                    ? 'bg-theme-card text-theme-brand font-semibold' 
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
                            
                            <div className="flex space-x-2 pt-4 border-t border-theme-border">
                                <button className="w-1/3 bg-theme-brand text-white px-4 py-2 rounded hover:bg-theme-brand-light transition-colors cursor-pointer">
                                    Exam Mode
                                </button>
                                <button className="w-2/3 bg-theme-card text-theme-text-main border border-theme-border px-4 py-2 rounded hover:bg-theme-card-light transition-colors cursor-pointer">
                                    Practice Mode
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};