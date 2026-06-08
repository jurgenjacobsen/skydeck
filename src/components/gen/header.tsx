import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Search,
    Bell,
    ChevronDown,
    User,
    Settings,
    Sliders,
    LogOut,
} from 'lucide-react';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine active tab/page based on pathname
    const pathname = location.pathname;
    const activeTab = pathname.slice(1) || (pathname === '/' && 'dashboard');

    // Real-time clocks
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const localTimeStr = time.toLocaleTimeString(['en-GB'], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    const zuluTimeStr = time.toISOString().substring(11, 19) + 'Z';

    return (
        <header className="h-16 border-b border-theme-border bg-theme-card flex items-center justify-between px-8 shrink-0 z-10">
            {/* Path / Section indicator */}
            <div className="flex items-center gap-2 text-xs tracking-wider text-theme-text-muted">
                <span>SKYDECK</span>
                <ChevronRight className="w-3 h-3 text-theme-text-muted" />
                <span className="text-theme-brand uppercase font-semibold">{activeTab}</span>
            </div>

            {/* Search bar */}
            <div className="relative w-100">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-theme-text-muted">
                    <Search className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    placeholder="Search regulations, procedures, subjects..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (activeTab !== 'wiki' && activeTab !== 'dashboard') {
                            navigate('/wiki');
                        }
                    }}
                    className="w-full bg-theme-extra-light border border-theme-border text-theme-text-dark pl-9 pr-4 py-2 rounded text-xs focus:outline-none focus:border-theme-brand transition-all"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-text-muted hover:text-theme-text-main"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Zulu Clocks & User Profile */}
            <div className="flex items-center gap-6">
                {/* Clocks */}
                <div className="flex items-center gap-4 text-xs font-mono border-r border-theme-border pr-6">
                    <div className="text-right">
                        <span className="text-theme-text-muted mr-1.5 font-semibold">LCL:</span>
                        <span className="text-theme-text-dark font-bold">{localTimeStr}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-theme-text-muted mr-1.5 font-semibold">ZULU:</span>
                        <span className="text-theme-brand font-bold">{zuluTimeStr}</span>
                    </div>
                </div>

                {/* Bell/Notif */}
                <button className="relative text-theme-text-muted hover:text-theme-text-dark transition-colors">
                    <Bell className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-theme-error"></span>
                </button>

                {/* Profile Avatar Widget & Dropdown */}
                <div className="relative group flex items-center gap-3 cursor-pointer py-2">
                    <div className="w-8 h-8 rounded bg-theme-bg border border-theme-border flex items-center justify-center font-bold text-theme-brand text-xs shadow-sm">
                        SJ
                    </div>
                    <div className="hidden md:block text-left">
                        <div className="text-xs font-bold text-theme-text-dark leading-tight">
                            Capt. Sarah Jenkins
                        </div>
                        <div className="text-xs text-theme-text-muted leading-none">
                            A320 Type Rated
                        </div>
                    </div>
                    <div className="hidden lg:block text-theme-text-muted text-xs">
                        <ChevronDown className="w-3 h-3 group-hover:text-theme-brand transition-colors" />
                    </div>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-[110%] w-48 bg-theme-card border border-theme-border rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 py-1 text-xs select-none">
                        <div className="px-4 py-2 border-b border-theme-border bg-theme-extra-light">
                            <div className="font-bold text-theme-text-dark">Sarah Jenkins</div>
                            <div className="text-xs text-theme-text-muted">
                                sarah.j@skydeck.aero
                            </div>
                        </div>

                        <a
                            href="#profile"
                            className="flex items-center gap-2 px-4 py-2 text-theme-text-main hover:bg-theme-bg hover:text-theme-text-dark transition-colors"
                        >
                            <User className="w-3.5 h-3.5 text-theme-text-muted" />
                            <span>My Profile</span>
                        </a>

                        <a
                            href="#settings"
                            className="flex items-center gap-2 px-4 py-2 text-theme-text-main hover:bg-theme-bg hover:text-theme-text-dark transition-colors"
                        >
                            <Settings className="w-3.5 h-3.5 text-theme-text-muted" />
                            <span>Settings</span>
                        </a>

                        <a
                            href="#config"
                            className="flex items-center gap-2 px-4 py-2 text-theme-text-main hover:bg-theme-bg hover:text-theme-text-dark transition-colors"
                        >
                            <Sliders className="w-3.5 h-3.5 text-theme-text-muted" />
                            <span>Simulator Config</span>
                        </a>

                        <div className="border-t border-theme-border my-1"></div>

                        <a
                            href="#logout"
                            className="flex items-center gap-2 px-4 py-2 text-theme-error hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="font-semibold">Log Out</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
