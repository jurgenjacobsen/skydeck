import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/gen/sidebar';
import Header from './components/gen/header';
import Dashboard from './pages/Dashboard';
import QBank from './pages/QBank';
import Wiki from './pages/Wiki';
import Flows from './pages/Flows';
import Briefing from './pages/Briefing';

function App() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-theme-bg flex overflow-hidden text-theme-text-main">
            {/* 1. LEFT SIDEBAR */}
            <Sidebar />

            {/* 2. MAIN LAYOUT CONTAINER */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* TOP HEADER / NAVBAR */}
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {/* 3. MAIN WORKSPACE */}
                <main className="flex-1 overflow-y-auto bg-theme-bg p-8">
                    <Routes>
                        <Route path="/" element={<Dashboard qStreak={14} />} />
                        <Route path="/dashboard" element={<Dashboard qStreak={14} />} />
                        <Route path="/qbank" element={<QBank qStreak={14} />} />
                        <Route path="/wiki" element={<Wiki searchQuery={searchQuery} />} />
                        <Route path="/flows" element={<Flows />} />
                        <Route path="/briefing" element={<Briefing />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
