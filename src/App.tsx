import { useState, useEffect } from 'react';

import Sidebar from '@/gen/sidebar';
import Header from '@/gen/header';
import SearchModal from '@/gen/search-modal';

import { Dashboard, QBank, Flows, Briefing, Wiki, NotFound, Landing } from './pages';

import { Route, Routes, useLocation, useSearchParams } from 'react-router-dom';

export default function App() { 
    const location = useLocation();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const wikiQuery = searchParams.get('q') || '';

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (location.pathname === '/') {
        return <Landing />;
    }

    return (
        <div className="min-h-screen bg-theme-bg flex overflow-hidden text-theme-text-main text-xs">
            {/* 1. LEFT SIDEBAR */}
            <Sidebar />

            {/* 2. MAIN LAYOUT CONTAINER */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* TOP HEADER / NAVBAR */}
                <Header onSearchClick={() => setIsSearchOpen(true)} />

                {/* 3. MAIN WORKSPACE */}
                <main className="flex-1 overflow-y-auto bg-theme-bg p-6">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/qbank" element={<QBank />} />
                        <Route path="/legislation" element={<Wiki searchQuery={wikiQuery} />} />
                        <Route path="/flows" element={<Flows />} />
                        <Route path="/briefing" element={<Briefing />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            </div>
        </div>
    );
}