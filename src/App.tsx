import { Routes, Route } from 'react-router-dom';

import Sidebar from '@/gen/sidebar';
import Header from '@/gen/header';
import Dashboard from './pages/Dashboard';
import QBank from './pages/QBank';
import Flows from './pages/Flows';
import Briefing from './pages/Briefing';
import NotFound from './pages/NotFound';

export default function App() { 

    // CTRL + K = alert hello world
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            alert('CTRL + K pressed!');
        }
    });
    

    return (
        <div className="min-h-screen bg-theme-bg flex overflow-hidden text-theme-text-main">
            {/* 1. LEFT SIDEBAR */}
            <Sidebar />

            {/* 2. MAIN LAYOUT CONTAINER */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* TOP HEADER / NAVBAR */}
                <Header />

                {/* 3. MAIN WORKSPACE */}
                <main className="flex-1 overflow-y-auto bg-theme-bg p-8">
                    <Routes>
                        <Route path="/" element={<Dashboard qStreak={14} />} />
                        <Route path="/dashboard" element={<Dashboard qStreak={14} />} />
                        <Route path="/qbank" element={<QBank qStreak={14} />} />
                        
                        <Route path="/flows" element={<Flows />} />
                        <Route path="/briefing" element={<Briefing />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}