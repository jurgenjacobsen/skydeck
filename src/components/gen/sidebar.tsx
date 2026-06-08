import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Calculator, BookOpen, Workflow, FileText } from 'lucide-react';
import packageJson from '../../../package.json';

export default function Sidebar() {
    const location = useLocation();
    const pathname = location.pathname;
    const activeTab = pathname.slice(1);

    return (
        <aside className="w-60 border-r border-theme-border bg-theme-card flex flex-col justify-between shrink-0 select-none z-10">
            <div>
                {/* Logo Brand */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-theme-border">
                    <div>
                        <span className="text-xl font-black tracking-tight text-theme-text-dark">
                            SKY<span className="text-theme-brand">DECK</span>
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-1 text-sm">
                    <Link
                        to="/dashboard"
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all text-left font-medium ${
                            activeTab === 'dashboard'
                                ? 'bg-theme-info-light text-theme-brand font-semibold'
                                : 'text-theme-text-main hover:text-theme-text-dark hover:bg-theme-bg'
                        }`}
                    >
                        <LayoutDashboard
                            className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-theme-brand' : 'text-theme-text-muted'}`}
                        />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to="/qbank"
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all text-left font-medium ${
                            activeTab === 'qbank'
                                ? 'bg-theme-info-light text-theme-brand font-semibold'
                                : 'text-theme-text-main hover:text-theme-text-dark hover:bg-theme-bg'
                        }`}
                    >
                        <Calculator
                            className={`w-4 h-4 ${activeTab === 'qbank' ? 'text-theme-brand' : 'text-theme-text-muted'}`}
                        />
                        <div className="flex-1 flex items-center justify-between">
                            <span>ATPL Q-Bank</span>
                        </div>
                    </Link>

                    <Link
                        to="/wiki"
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all text-left font-medium ${
                            activeTab === 'wiki'
                                ? 'bg-theme-info-light text-theme-brand font-semibold'
                                : 'text-theme-text-main hover:text-theme-text-dark hover:bg-theme-bg'
                        }`}
                    >
                        <BookOpen
                            className={`w-4 h-4 ${activeTab === 'wiki' ? 'text-theme-brand' : 'text-theme-text-muted'}`}
                        />
                        <span>Legislation Wiki</span>
                    </Link>

                    <Link
                        to="/flows"
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all text-left font-medium ${
                            activeTab === 'flows'
                                ? 'bg-theme-info-light text-theme-brand font-semibold'
                                : 'text-theme-text-main hover:text-theme-text-dark hover:bg-theme-bg'
                        }`}
                    >
                        <Workflow
                            className={`w-4 h-4 ${activeTab === 'flows' ? 'text-theme-brand' : 'text-theme-text-muted'}`}
                        />
                        <div className="flex-1 flex items-center justify-between">
                            <span>Flows Trainer</span>
                        </div>
                    </Link>

                    <Link
                        to="/briefing"
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all text-left font-medium ${
                            activeTab === 'briefing'
                                ? 'bg-theme-info-light text-theme-brand font-semibold'
                                : 'text-theme-text-main hover:text-theme-text-dark hover:bg-theme-bg'
                        }`}
                    >
                        <FileText
                            className={`w-4 h-4 ${activeTab === 'briefing' ? 'text-theme-brand' : 'text-theme-text-muted'}`}
                        />
                        <span>Flight Briefing</span>
                    </Link>
                </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-theme-border space-y-3">
                <div className="flex items-center gap-3 bg-theme-extra-light p-3 rounded border border-theme-border">
                    <div className="w-2 h-2 rounded-full bg-theme-success"></div>
                    <div className="text-xs">
                        <div className="font-semibold text-theme-text-dark">System Ready</div>
                        <div className="text-theme-text-muted text-xs">All databases online</div>
                    </div>
                </div>
                <div className="text-xs text-theme-text-muted text-center">
                    SkyDeck EFB v{packageJson.version}
                </div>
            </div>
        </aside>
    );
}
