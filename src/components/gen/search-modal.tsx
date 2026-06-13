import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Home,
    GraduationCap,
    BookOpen,
    Workflow,
    FileText,
    Sparkles,
    CornerDownLeft,
    X,
} from 'lucide-react';

interface SearchItem {
    id: string;
    title: string;
    description: string;
    category: 'Navigation' | 'Legislation Wiki' | 'Actions';
    icon: React.ComponentType<{ size?: number; className?: string }>;
    perform: () => void;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [recentIds, setRecentIds] = useState<string[]>(() => {
        const stored = localStorage.getItem('skydeck_recent_searches');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error(e);
            }
        }
        return [];
    });

    const recordClick = (id: string) => {
        setRecentIds((prev) => {
            const next = [id, ...prev.filter((x) => x !== id)].slice(0, 3);
            localStorage.setItem('skydeck_recent_searches', JSON.stringify(next));
            return next;
        });
    };

    const selectItem = (item: SearchItem) => {
        recordClick(item.id);
        item.perform();
        onClose();
    };

    const items: SearchItem[] = useMemo(() => [
        // Navigation Section
        {
            id: 'nav-home',
            title: 'Go to Home / Dashboard',
            description: 'Main overview, training streak, and flight stats',
            category: 'Navigation',
            icon: Home,
            perform: () => navigate('/dashboard'),
        },
        {
            id: 'nav-qbank',
            title: 'Go to Q-Bank',
            description: 'Practice exams, questions, and revision stats',
            category: 'Navigation',
            icon: GraduationCap,
            perform: () => navigate('/qbank'),
        },
        {
            id: 'nav-legislation',
            title: 'Go to Legislation Wiki',
            description: 'EASA and ICAO air law database',
            category: 'Navigation',
            icon: BookOpen,
            perform: () => navigate('/legislation'),
        },
        {
            id: 'nav-flows',
            title: 'Go to Flows Trainer',
            description: 'Interactive cockpit procedures and checklists',
            category: 'Navigation',
            icon: Workflow,
            perform: () => navigate('/flows'),
        },
        {
            id: 'nav-briefing',
            title: 'Go to Flight Briefing',
            description: 'Current weather packages, checklists, and airport briefings',
            category: 'Navigation',
            icon: FileText,
            perform: () => navigate('/briefing'),
        },
        // Legislation Wiki Section
        {
            id: 'wiki-025',
            title: 'EASA Part-FCL.025',
            description: 'Theoretical knowledge exams rules & validity period',
            category: 'Legislation Wiki',
            icon: BookOpen,
            perform: () => navigate('/legislation?q=EASA Part-FCL.025'),
        },
        {
            id: 'wiki-125',
            title: 'EASA Part-CAT.IDE.A.125',
            description: 'Instruments and equipment required for VFR flights',
            category: 'Legislation Wiki',
            icon: BookOpen,
            perform: () => navigate('/legislation?q=EASA Part-CAT.IDE.A.125'),
        },
        {
            id: 'wiki-740',
            title: 'EASA Part-FCL.740',
            description: 'Revalidation rules for class and type ratings',
            category: 'Legislation Wiki',
            icon: BookOpen,
            perform: () => navigate('/legislation?q=EASA Part-FCL.740'),
        },
        {
            id: 'wiki-annex2',
            title: 'ICAO Annex 2: Rules of the Air',
            description: 'Right of way and overtaking rules for flight operations',
            category: 'Legislation Wiki',
            icon: BookOpen,
            perform: () => navigate('/legislation?q=ICAO Annex 2'),
        },
        {
            id: 'wiki-180',
            title: 'EASA CAT.OP.MPA.180',
            description: 'Fuel reserves policy for jet aeroplanes (contingency fuel)',
            category: 'Legislation Wiki',
            icon: BookOpen,
            perform: () => navigate('/legislation?q=EASA CAT.OP.MPA.180'),
        },
        // Quick Actions Section
        {
            id: 'act-qbank-start',
            title: 'Quick Practice Session',
            description: 'Instantly launch a randomized 10-question practice test',
            category: 'Actions',
            icon: Sparkles,
            perform: () => navigate('/qbank'),
        },
    ], [navigate]);

    // Filter items based on search input
    const filteredItems = useMemo(() => {
        const lowerQuery = query.toLowerCase();
        return items.filter((item) => {
            const searchContent = `${item.title} ${item.description} ${item.category}`.toLowerCase();
            return searchContent.includes(lowerQuery);
        });
    }, [items, query]);

    const recentItems = useMemo(() => {
        const matchingRecents = recentIds
            .map((id) => items.find((item) => item.id === id))
            .filter((item): item is SearchItem => !!item);

        const lowerQuery = query.toLowerCase();
        return matchingRecents.filter((item) => {
            const searchContent = `${item.title} ${item.description}`.toLowerCase();
            return searchContent.includes(lowerQuery);
        }).slice(0, 3);
    }, [recentIds, items, query]);

    const categories = useMemo(() => {
        return recentItems.length > 0
            ? (['Recent', 'Navigation', 'Legislation Wiki', 'Actions'] as const)
            : (['Navigation', 'Legislation Wiki', 'Actions'] as const);
    }, [recentItems]);

    const visibleItems = useMemo(() => {
        const list: SearchItem[] = [];
        categories.forEach((category) => {
            if (category === 'Recent') {
                list.push(...recentItems);
            } else {
                const categoryItems = filteredItems.filter(
                    (item) => item.category === category && !recentItems.some((r) => r.id === item.id)
                );
                list.push(...categoryItems);
            }
        });
        return list;
    }, [categories, recentItems, filteredItems]);

    // Auto-focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    // Handle index bounds when filter updates
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Keyboard navigation handlers
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }

            if (visibleItems.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % visibleItems.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + visibleItems.length) % visibleItems.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (visibleItems[selectedIndex]) {
                    selectItem(visibleItems[selectedIndex]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, visibleItems, selectedIndex, onClose]);

    // Scroll active item into view
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeElement = scrollContainerRef.current.querySelector('[aria-selected="true"]');
            if (activeElement) {
                activeElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Backdrop overlay */}
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black/25 backdrop-blur-xs transition-opacity ease-out ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
                }`}
            />

            {/* Modal Card Container */}
            <div className="absolute left-72 right-0 top-0 bottom-0 flex items-start justify-center pt-14 px-4 pointer-events-none">
                {/* Modal Card */}
                <div className={`relative w-full max-w-xl bg-theme-card backdrop-blur-md border border-theme-border rounded overflow-hidden flex flex-col max-h-[70vh] transition-[transform,opacity] ease-out will-change-transform ${
                    isOpen ? 'scale-100 translate-y-0 opacity-100 pointer-events-auto' : 'scale-95 -translate-y-4 opacity-0'
                }`}>
                {/* Search Input Bar */}
                <div className="flex items-center gap-4 px-4 border-b border-theme-border shrink-0">
                    <Search className="w-6 h-6 text-theme-text-muted" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search pages, regulations, or actions..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full py-4 text-sm text-theme-text-dark bg-transparent border-0 focus:outline-none focus:ring-0"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="p-1 text-theme-text-muted hover:text-theme-text-main rounded-full hover:bg-theme-bg"
                        >
                            <X size={14} />
                        </button>
                    )}
                    <kbd className="px-2 py-1 rounded bg-theme-bg border border-theme-border text-xs font-mono text-theme-text-muted select-none font-semibold">
                        ESC
                    </kbd>
                </div>

                {/* Results list */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto p-2 divide-y divide-transparent"
                >
                    {visibleItems.length > 0 ? (
                        categories.map((category) => {
                            const categoryItems = category === 'Recent'
                                ? recentItems
                                : filteredItems.filter(
                                    (item) => item.category === category && !recentItems.some((r) => r.id === item.id)
                                  );
                            if (categoryItems.length === 0) return null;

                            return (
                                <div key={category} className="py-2 first:pt-1">
                                    <div className="px-2 py-1 text-xs font-semibold text-theme-text-muted tracking-wider uppercase select-none">
                                        {category}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        {categoryItems.map((item) => {
                                            const currentAbsoluteIndex = visibleItems.findIndex((x) => x.id === item.id);
                                            const isSelected = selectedIndex === currentAbsoluteIndex;
                                            const IconComponent = item.icon;

                                            return (
                                                <div
                                                    key={item.id}
                                                    aria-selected={isSelected}
                                                    onClick={() => {
                                                        selectItem(item);
                                                    }}
                                                    className={`group flex items-center justify-between px-2 py-2 rounded cursor-pointer transition-all border-l-2 ${
                                                        isSelected
                                                            ? 'bg-theme-brand/5 border-theme-brand text-theme-brand translate-x-1'
                                                            : 'bg-transparent border-transparent hover:bg-theme-bg/50 text-theme-text-main'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className={`p-2 rounded-md ${
                                                            isSelected ? 'bg-theme-brand/25 text-theme-brand' : 'bg-theme-bg text-theme-text-muted group-hover:bg-theme-card'
                                                        }`}>
                                                            <IconComponent size={16} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className={`text-xs font-semibold ${
                                                                isSelected ? 'text-theme-brand' : 'text-theme-text-dark'
                                                            }`}>
                                                                {item.title}
                                                            </div>
                                                            <div className="text-xs text-theme-text-muted truncate">
                                                                {item.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="flex items-center gap-2 text-xs font-semibold text-theme-brand shrink-0 pr-1 animate-pulse">
                                                            <span>Go</span>
                                                            <CornerDownLeft size={10} />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center select-none">
                            <Search className="w-8 h-8 text-theme-text-muted mb-2 animate-bounce" />
                            <div className="font-semibold text-theme-text-dark text-xs">No matching results</div>
                            <div className="text-[10px] text-theme-text-muted mt-0.5">
                                Try searching for "Q-Bank", "briefing", "Part-FCL", or "rules".
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer instructions */}
                <div className="flex justify-between items-center px-4 py-2 border-t border-theme-border bg-theme-extra-light text-[9px] text-theme-text-muted shrink-0 select-none">
                    <div className="flex gap-4">
                        <span>
                            <kbd className="p-1 rounded bg-theme-bg border border-theme-border font-mono mr-2">↑↓</kbd>
                            to navigate
                        </span>
                        <span>
                            <kbd className="p-1 rounded bg-theme-bg border border-theme-border font-mono mr-2">Enter</kbd>
                            to select
                        </span>
                    </div>
                    <span>
                        <kbd className="p-1 rounded bg-theme-bg border border-theme-border font-mono mr-2">ESC</kbd>
                        to close
                    </span>
                </div>
            </div>
        </div>
    </div>
    );
}
