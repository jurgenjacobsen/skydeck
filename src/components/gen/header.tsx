import { useState, useEffect, useRef } from 'react';
import {
    ChevronDown,
    User as UserIcon,
    Settings,
    Sliders,
    LogOut,
    BellIcon,
    SearchIcon,
    AlertTriangle,
    CheckCircle2,
    Info,
    Calendar,
    X,
    ChevronRightIcon,
    CloudSunIcon,
    RefreshCw,
    Wind,
    Compass,
    Eye,
    Thermometer,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DevPanel from './dev-panel';

export default function Header({ onSearchClick }: { onSearchClick?: () => void }) {
    const [isDevPanelOpen, setIsDevPanelOpen] = useState(false);

    return (
        <header className="h-14 bg-theme-card border-b border-theme-border grid grid-cols-3 gap-4 px-6 shrink-0 z-10 select-none text-xs">
            {/* Path / Section indicator */}
            <div className="flex items-center justify-between">
                <Location />
            </div>

            {/* Search Bar */}
            <div className="flex items-center justify-center w-full">
                <SearchBar onClick={onSearchClick} />
            </div>

            {/* Right Side Widgets */}
            <div className="flex items-center justify-end space-x-2">
                <Clock />
                <Weather />
                <Notifications />
                <User />
            </div>
            <DevPanel isOpen={isDevPanelOpen} onClose={() => setIsDevPanelOpen(false)} />
        </header>
    );
}

function SearchBar({ onClick }: { onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className="max-w-2/3 relative overflow-hidden cursor-pointer w-full"
        >
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
                <SearchIcon className="w-4 h-4 text-theme-text-muted" />
            </div>
            <input
                type="text"
                readOnly
                placeholder="Search..."
                className="w-full pl-10 pr-22 py-1.5 rounded border border-theme-border bg-theme-bg text-xs focus:outline-none focus:ring-none focus:border-theme-brand transition-all cursor-pointer pointer-events-none"
            />
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
                className="absolute inset-y-0 right-0 flex items-center rounded m-1 px-2 text-vs font-mono bg-theme-card border border-theme-border text-theme-text-muted select-none font-semibold"
            >
                CTRL + K
            </button>
        </div>
    );
}

interface Notification {
    id: string;
    type: 'warning' | 'info' | 'success' | 'schedule';
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
}

function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const stored = localStorage.getItem('skydeck_notifications');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error(e);
            }
        }
        return [
            {
                id: '1',
                type: 'warning',
                title: 'SOP Revision Alert',
                description: 'A320 Cabin Altitude checklist revised. Review required before next checkride.',
                timestamp: '15m ago',
                read: false,
            },
            {
                id: '2',
                type: 'info',
                title: 'Briefing Package Ready',
                description: 'BA482 (LHR to CDG) flight briefing and weather package is available.',
                timestamp: '2h ago',
                read: false,
            },
            {
                id: '3',
                type: 'success',
                title: 'Checkride Flow Passed',
                description: 'You completed the "Cockpit Preparation" flow with 96% accuracy.',
                timestamp: '5h ago',
                read: true,
            },
            {
                id: '4',
                type: 'schedule',
                title: 'Simulator Schedule Update',
                description: 'Checkride scheduled for 18 June 2026 at 09:00 UTC in Sim-4.',
                timestamp: '1d ago',
                read: false,
            },
        ];
    });

    useEffect(() => {
        localStorage.setItem('skydeck_notifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.notification-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const unreadCount = notifications.filter((n) => !n.read).length;
    const [prevUnreadCount, setPrevUnreadCount] = useState(unreadCount);

    useEffect(() => {
        if (unreadCount > 0) {
            setPrevUnreadCount(unreadCount);
        }
    }, [unreadCount]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const markAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const deleteNotification = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(notifications.filter((n) => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'warning':
                return <AlertTriangle size={14} className="text-red-500" />;
            case 'info':
                return <Info size={14} className="text-blue-500" />;
            case 'success':
                return <CheckCircle2 size={14} className="text-green-500" />;
            case 'schedule':
                return <Calendar size={14} className="text-theme-brand" />;
        }
    };

    const getIconBg = (type: Notification['type']) => {
        switch (type) {
            case 'warning':
                return 'bg-red-100';
            case 'info':
                return 'bg-blue-100';
            case 'success':
                return 'bg-green-100';
            case 'schedule':
                return 'bg-theme-brand/10';
        }
    };

    return (
        <div className="relative notification-container flex items-center">
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
                aria-label="Notifications"
            >
                <BellIcon size={18} className="text-theme-text-muted hover:text-theme-text-main transition-colors" />
                <span className={`absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-vs font-bold text-white shadow ring-2 ring-white transition-all duration-300 ease-out origin-center ${
                    unreadCount > 0
                        ? 'scale-100 opacity-100'
                        : 'scale-0 opacity-0 pointer-events-none'
                }`}>
                    <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-red-500 opacity-40"></span>
                    <span className="relative">{unreadCount > 0 ? unreadCount : prevUnreadCount}</span>
                </span>
            </button>

            {/* Dropdown Card */}
            <div className={`absolute right-2 top-12 w-md bg-theme-card border border-theme-border rounded shadow z-50 overflow-hidden flex flex-col text-xs transition-all duration-150 ${
                isOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2 pointer-events-none'
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-theme-border bg-theme-extra-light">
                    <div className="text-theme-text-dark flex items-center gap-2 text-xs font-bold tracking-wide">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-theme-brand/5 text-theme-brand px-2 py-1 rounded text-vs font-medium">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-theme-brand hover:text-theme-brand-light cursor-pointer font-medium text-vs"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-theme-border-soft">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                className={`flex gap-3 px-4 py-2 transition-colors cursor-pointer relative group/item ${
                                    notification.read
                                        ? 'hover:bg-theme-bg'
                                        : 'bg-theme-info-light/25 hover:bg-theme-info-light/50'
                                }`}
                            >
                                {/* Icon container */}
                                <div className="flex items-center justify-center shrink-0 mt-0.5">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getIconBg(
                                            notification.type
                                        )}`}
                                    >
                                        {getIcon(notification.type)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pr-10 pl-2">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span
                                            className={`text-xs truncate font-semibold text-theme-text-dark ${
                                                !notification.read ? 'font-bold' : ''
                                            }`}
                                        >
                                            {notification.title} 
                                        </span>
                                        <span className="text-theme-text-muted text-vs">
                                            {notification.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-theme-text-main leading-normal wrap-break-word tracking-wide">
                                        {notification.description}
                                    </p>
                                </div>
                            
                                {/* Unread indicator dot & delete button centered vertically */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6">
                                    {!notification.read && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-theme-brand shrink-0 group-hover/item:hidden"></span>
                                    )}
                                    <button
                                        onClick={(e) => deleteNotification(notification.id, e)}
                                        className="hidden group-hover/item:flex items-center justify-center text-theme-text-muted hover:text-theme-error p-1 rounded hover:bg-theme-border/50 cursor-pointer"
                                        title="Delete notification"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                            <div className="w-10 h-10 rounded-full bg-theme-bg flex items-center justify-center text-theme-text-muted mb-2">
                                <BellIcon size={18} />
                            </div>
                            <div className="font-semibold text-theme-text-dark text-sm">Clear skies ahead</div>
                            <div className=" text-theme-text-muted mt-0.5">
                                No notifications. Safe flying!
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-theme-border bg-theme-extra-light text-center flex justify-between items-center text-theme-text-muted">
                        <span>Showing {notifications.length} updates</span>
                        <button
                            onClick={clearAll}
                            className="text-theme-text-muted font-medium cursor-pointer tracking-wide hover:text-red-500 transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const localTimeStr = time.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const zuluTimeStr = time.toISOString().substring(11, 19);

    return (
        <div className="flex items-center gap-4 border-r border-theme-border px-4">
            {/* Local Time */}
            <div className="flex items-center gap-2">
                <span className="text-vs uppercase font-bold text-theme-text-muted tracking-wider">LCL</span>
                <span className="text-theme-text-dark font-semibold font-mono tabular-nums">{localTimeStr}</span>
            </div>
            {/* Zulu Time */}
            <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 text-vs font-bold uppercase tracking-wider">
                    <span className="w-1 h-1 rounded-full bg-theme-brand"></span>
                    UTC
                </span>
                <span className="tabular-nums font-mono">{zuluTimeStr}Z</span>
            </div>
        </div>
    );
}

function User() {
    return (
        <div className="relative group flex items-center gap-4 cursor-pointer py-1 px-2 rounded-lg hover:bg-theme-extra-light transition-all group max-w-96">
            <div className="aspect-square w-8 h-8 rounded bg-theme-info-light flex items-center justify-center font-bold text-xs shadow relative">
                SJ
            </div>
            <div className="hidden md:block text-left">
                <div className="font-bold text-theme-text-dark leading-tight truncate">
                    Capt. Sarah Jenkins
                </div>
                <div className="text-theme-text-muted leading-none font-medium mt-0.5 hidden lg:block text-vs">
                    A320 Type Rated
                </div>
            </div>
            <div className="hidden lg:block text-theme-text-muted text-xs">
                <ChevronDown className="w-3 h-3 group-hover:transform group-hover:rotate-180 transition-transform duration-300" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-[120%] w-64 bg-theme-card border border-theme-border rounded shadow opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-y-2 group-hover:translate-y-0 transition-all duration-150 z-50 text-xs select-none">
                <div className="px-4 py-2 border-b border-theme-border bg-theme-extra-light cursor-default select-text">
                    <div className="font-bold text-theme-text-dark">Sarah Jenkins</div>
                    <div className="text-theme-text-muted">
                        sarah.j@skydeck.aero
                    </div>
                </div>

                <a
                    href="#profile"
                    className="flex items-center gap-2 px-4 py-2 text-theme-text-main hover:bg-theme-bg hover:text-theme-text-dark transition-colors"
                >
                    <UserIcon className="w-4 h-4 text-theme-text-muted" />
                    <span>My Profile</span>
                </a>

                <a
                    href="#settings"
                    className="flex items-center gap-2 px-4 py-2 text-theme-text-main hover:bg-theme-bg hover:text-theme-text-dark transition-colors"
                >
                    <Settings className="w-4 h-4 text-theme-text-muted" />
                    <span>Settings</span>
                </a>

                <a
                    href="#config"
                    className="flex items-center gap-2 px-4 py-2 text-theme-text-main hover:bg-theme-bg hover:text-theme-text-dark transition-colors"
                >
                    <Sliders className="w-4 h-4 text-theme-text-muted" />
                    <span>Simulator Config</span>
                </a>

                <div className="border-t border-theme-border"></div>

                <a
                    href="#logout"
                    className="flex items-center gap-2 px-4 py-2 text-theme-error transition-colors hover:bg-theme-bg"
                >
                    <LogOut className="w-4 h-4 group-hover:text-red-500" />
                    <span className="font-medium group-hover:text-red-500">Log Out</span>
                </a>
            </div>
        </div>
    );
}

function Location() {
    const loc = useLocation();
    
    // Split the pathname and filter out empty segments
    const segments = loc.pathname.split('/').filter(Boolean);
    
    // Default to 'Home' if the pathname is empty or root '/'
    const pathSegments = segments.length > 0 ? segments : ['Home'];

    return (
        <div className="flex items-center gap-2 font-semibold text-theme-text-muted select-none tracking-wide">
            {pathSegments.map((segment, index) => (
                <div key={index} className="flex items-center gap-2 capitalize">
                    <ChevronRightIcon className="w-4 h-4 text-theme-text-muted shrink-0" />
                    <span className={index === pathSegments.length - 1 ? "text-theme-text-dark font-bold" : ""}>
                        {segment}
                    </span>
                </div>
            ))}
        </div>
    );
}

function Weather() {
    const [isOpen, setIsOpen] = useState(false);
    const [aerodrome, setAerodrome] = useState(() => {
        return localStorage.getItem('homebase_aerodrome') || 'EGLL';
    });
    const [metar, setMetar] = useState('Loading...');
    const [taf, setTaf] = useState('Loading...');
    const [loading, setLoading] = useState(false);
    const [hasUpdate, setHasUpdate] = useState(false);

    const metarRef = useRef(metar);
    const tafRef = useRef(taf);

    useEffect(() => {
        metarRef.current = metar;
    }, [metar]);

    useEffect(() => {
        tafRef.current = taf;
    }, [taf]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleAerodromeChange = () => {
        const input = window.prompt('Enter ICAO Aerodrome code (e.g. EGLL, LFPG, KJFK):', aerodrome);
        if (input !== null) {
            const code = input.trim().toUpperCase();
            if (code.length === 4) {
                setAerodrome(code);
                localStorage.setItem('homebase_aerodrome', code);
            } else if (code.length > 0) {
                window.alert('Aerodrome code must be a 4-letter ICAO code.');
            }
        }
    };

    // Mock data fallback mapping
    const getMockWeather = (icao: string) => {
        const normalized = icao.toUpperCase();
        if (normalized === 'EGLL') {
            return {
                metar: 'EGLL 251750Z 24012KT 9999 FEW025 21/14 Q1013 NOSIG',
                taf: 'EGLL 251700Z 2518/2624 23010KT 9999 FEW030 PROB30 TEMPO 2520/2602 -SHRA BKN020'
            };
        } else if (normalized === 'LFPG') {
            return {
                metar: 'LFPG 251750Z 26010KT 9999 BKN035 22/13 Q1015 NOSIG',
                taf: 'LFPG 251700Z 2518/2624 25008KT 9999 BKN040 TX23/2614Z TN15/2604Z'
            };
        } else if (normalized === 'KJFK') {
            return {
                metar: 'KJFK 251751Z 18015KT 10SM SCT025 BKN250 24/19 A2992 RMK AO2',
                taf: 'KJFK 251730Z 2518/2624 19014G20KT P6SM FEW030 SCT250'
            };
        }
        return {
            metar: `${normalized} 251750Z 19010KT 9999 FEW030 20/15 Q1013`,
            taf: `${normalized} 251700Z 2518/2624 18008KT 9999 FEW035`
        };
    };

    const fetchWeather = () => {
        setLoading(true);

        const metarTarget = `https://aviationweather.gov/api/data/metar?ids=${aerodrome}&format=json`;
        const metarUrl = `https://corsproxy.io/?${encodeURIComponent(metarTarget)}`;
        const tafTarget = `https://aviationweather.gov/api/data/taf?ids=${aerodrome}&format=json`;
        const tafUrl = `https://corsproxy.io/?${encodeURIComponent(tafTarget)}`;

        let metarFinished = false;
        let tafFinished = false;

        const checkFinished = () => {
            if (metarFinished && tafFinished) {
                setLoading(false);
            }
        };

        // Fetch METAR
        fetch(metarUrl)
            .then((res) => {
                if (!res.ok) throw new Error('METAR fetch failed');
                return res.json();
            })
            .then((data) => {
                const item = Array.isArray(data) ? data[0] : data;
                const newMetar = item?.rawOb || getMockWeather(aerodrome).metar;
                
                if (metarRef.current !== 'Loading...' && metarRef.current !== newMetar) {
                    setHasUpdate(true);
                }
                setMetar(newMetar);
                metarFinished = true;
                checkFinished();
            })
            .catch(() => {
                const fallback = getMockWeather(aerodrome).metar;
                if (metarRef.current !== 'Loading...' && metarRef.current !== fallback) {
                    setHasUpdate(true);
                }
                setMetar(fallback);
                metarFinished = true;
                checkFinished();
            });

        // Fetch TAF
        fetch(tafUrl)
            .then((res) => {
                if (!res.ok) throw new Error('TAF fetch failed');
                return res.json();
            })
            .then((data) => {
                const item = Array.isArray(data) ? data[0] : data;
                const newTaf = item?.rawTAF || getMockWeather(aerodrome).taf;

                if (tafRef.current !== 'Loading...' && tafRef.current !== newTaf) {
                    setHasUpdate(true);
                }
                setTaf(newTaf);
                tafFinished = true;
                checkFinished();
            })
            .catch(() => {
                const fallback = getMockWeather(aerodrome).taf;
                if (tafRef.current !== 'Loading...' && tafRef.current !== fallback) {
                    setHasUpdate(true);
                }
                setTaf(fallback);
                tafFinished = true;
                checkFinished();
            });
    };

    // Load active homebase aerodrome on dropdown open, and clear notification dot
    useEffect(() => {
        if (isOpen) {
            setHasUpdate(false);
            const stored = localStorage.getItem('homebase_aerodrome') || 'EGLL';
            setAerodrome(stored);
        }
    }, [isOpen]);

    // Fetch weather when aerodrome changes
    useEffect(() => {
        fetchWeather();
    }, [aerodrome]);

    // Set up periodic 15-minute fetch after first fetch
    useEffect(() => {
        const interval = setInterval(() => {
            fetchWeather();
        }, 15 * 60 * 1000);

        return () => clearInterval(interval);
    }, [aerodrome]);

    // Click outside handler
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.weather-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Parse METAR for display
    const decoded = (() => {
        const raw = metar || '';
        // Wind: e.g. 24012KT, 24012G20KT, VRB05KT
        const windMatch = raw.match(/(?:^|\s)(VRB|\d{3})(\d{2,3})(?:G(\d{2,3}))?KT/);
        // Visibility: e.g. 9999, 5000, 10SM, 1/2SM
        const visMatch = raw.match(/(?:^|\s)(\d{4})(?:\s|$)/) || raw.match(/(?:^|\s)(\d+(w:\/\d+)?SM)(?:\s|$)/);
        // Temp/Dew: e.g. 21/14, M02/M05, 05/M01
        const tempMatch = raw.match(/(?:^|\s)(M?\d{2})\/(M?\d{2})(?:\s|$)/);
        // QNH/Altimeter: e.g. Q1013, A2992
        const qnhMatch = raw.match(/(?:^|\s)Q(\d{4})(?:\s|$)/) || raw.match(/(?:^|\s)A(\d{4})(?:\s|$)/);

        let wind = 'Calm winds';
        if (windMatch) {
            const dir = windMatch[1] === 'VRB' ? 'Variable' : `${windMatch[1]}°`;
            const speed = parseInt(windMatch[2], 10);
            const gust = windMatch[3] ? ` gusting ${windMatch[3]} kt` : '';
            wind = `${dir} at ${speed} kt${gust}`;
        }

        let visibility = 'Unknown visibility';
        if (visMatch) {
            const visVal = visMatch[1];
            if (visVal === '9999') visibility = '10 km or more (CAVOK)';
            else if (visVal.endsWith('SM')) visibility = `${visVal}`;
            else visibility = `${parseInt(visVal, 10) / 1000} km`;
        }

        let temp = 'Unknown temp';
        if (tempMatch) {
            const tVal = tempMatch[1].startsWith('M') ? `-${tempMatch[1].substring(1)}` : tempMatch[1];
            const dVal = tempMatch[2].startsWith('M') ? `-${tempMatch[2].substring(1)}` : tempMatch[2];
            temp = `${tVal}°C / DP ${dVal}°C`;
        }

        let altimeter = 'Unknown altimeter';
        if (qnhMatch) {
            const val = qnhMatch[1];
            if (raw.includes(`Q${val}`)) altimeter = `QNH ${val} hPa`;
            else altimeter = `A${val.substring(0, 2)}.${val.substring(2)} inHg`;
        }

        // Determine flight category
        let flightRules: 'VFR' | 'IFR' | 'MVFR' = 'VFR';
        if (raw.includes('BKN008') || raw.includes('OVC008') || raw.includes('BKN005') || raw.includes('OVC005')) {
            flightRules = 'IFR';
        } else if (raw.includes('BKN015') || raw.includes('OVC015') || raw.includes('BKN025') || raw.includes('OVC025')) {
            flightRules = 'MVFR';
        }

        return { wind, visibility, temp, altimeter, flightRules };
    })();

    // Format TAF lines
    const formattedTafLines = (() => {
        const raw = taf || '';
        if (!raw) return [];
        const parts = raw.split(/(TEMPO|BECMG|FM\d+|PROB\d+)/g);
        const lines: string[] = [];
        let currentLine = '';

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i].trim();
            if (!part) continue;
            if (['TEMPO', 'BECMG'].includes(part) || part.startsWith('FM') || part.startsWith('PROB')) {
                if (currentLine) lines.push(currentLine);
                currentLine = part;
            } else {
                if (currentLine) currentLine += ' ' + part;
                else currentLine = part;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    })();

    return (
        <div className="relative weather-container flex items-center">
            <button 
                onClick={toggleDropdown}
                className="relative p-2 rounded-full transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
                aria-label="Weather"
                id="btn-weather-dropdown"
            >
                <CloudSunIcon size={18} className="text-theme-text-muted hover:text-theme-text-main transition-colors" />
                {loading && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-theme-brand animate-pulse"></span>
                )}
                {hasUpdate && !loading && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
            </button>

            {/* Dropdown Card */}
            <div className={`absolute right-10 top-12 w-md bg-theme-card border border-theme-border rounded shadow z-50 overflow-hidden flex flex-col text-xs transition-all duration-150 ${
                isOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2 pointer-events-none'
            }`}
            id="weather-dropdown-card"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-theme-border bg-theme-extra-light">
                    <div className="text-theme-text-dark flex items-center gap-2 text-xs font-bold tracking-wide">
                        Weather Briefing
                        <button
                            onClick={handleAerodromeChange}
                            className="bg-theme-bg hover:bg-theme-hover border border-theme-border rounded px-1.5 py-0.5 text-theme-text-dark font-mono text-vs cursor-pointer font-bold transition-colors"
                            title="Click to change aerodrome"
                            id="btn-change-aerodrome-header"
                        >
                            {aerodrome}
                        </button>
                        <span className={`px-2 py-0.5 rounded text-vs font-bold ${
                            decoded.flightRules === 'VFR'
                                ? 'bg-theme-success-light text-theme-success border border-theme-border-soft font-semibold'
                                : decoded.flightRules === 'IFR'
                                ? 'bg-theme-error-light text-theme-error border border-theme-border-soft font-semibold'
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                            {decoded.flightRules}
                        </span>
                    </div>
                    <button
                        onClick={fetchWeather}
                        className="text-theme-brand hover:text-theme-brand-light cursor-pointer font-medium text-vs flex items-center gap-1"
                        id="btn-refresh-weather"
                    >
                        <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {/* Weather Data Content */}
                <div className="max-h-80 overflow-y-auto divide-y divide-theme-border-soft">
                    {/* METAR Segment */}
                    <div className="p-4 space-y-2">
                        <div className="text-vs font-semibold text-theme-text-muted uppercase tracking-wider">
                            METAR
                        </div>
                        <div className="bg-theme-extra-light border border-theme-border rounded p-2 font-mono text-vs text-theme-text-dark leading-relaxed wrap-break-word">
                            {metar}
                        </div>
                        
                        {/* Decoded Items */}
                        <div className="grid grid-cols-2 gap-2 text-vs pt-1">
                            <div className="flex items-center gap-2 text-theme-text-main">
                                <Wind size={14} className="text-theme-text-muted shrink-0" />
                                <span>{decoded.wind}</span>
                            </div>
                            <div className="flex items-center gap-2 text-theme-text-main">
                                <Eye size={14} className="text-theme-text-muted shrink-0" />
                                <span>{decoded.visibility}</span>
                            </div>
                            <div className="flex items-center gap-2 text-theme-text-main">
                                <Thermometer size={14} className="text-theme-text-muted shrink-0" />
                                <span>{decoded.temp}</span>
                            </div>
                            <div className="flex items-center gap-2 text-theme-text-main">
                                <Compass size={14} className="text-theme-text-muted shrink-0" />
                                <span>{decoded.altimeter}</span>
                            </div>
                        </div>
                    </div>

                    {/* TAF Segment */}
                    <div className="p-4 space-y-2">
                        <div className="text-vs font-semibold text-theme-text-muted uppercase tracking-wider">
                            TAF
                        </div>
                        
                        {formattedTafLines.length > 0 ? (
                            <div className="bg-theme-extra-light border border-theme-border rounded p-2 font-mono text-vs text-theme-text-dark space-y-1 overflow-hidden">
                                {formattedTafLines.map((line, index) => (
                                    <div 
                                        key={index} 
                                        className={`leading-normal wrap-break-word ${
                                            line.startsWith('TEMPO') || line.startsWith('PROB') 
                                                ? 'text-amber-700 font-medium pl-2 border-l border-amber-300' 
                                                : line.startsWith('BECMG') || line.startsWith('FM') 
                                                ? 'text-blue-700 font-medium pl-2 border-l border-blue-300' 
                                                : ''
                                        }`}
                                    >
                                        {line}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-vs text-theme-text-muted italic">
                                No TAF forecast available for {aerodrome}.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-theme-border bg-theme-extra-light text-center flex justify-between items-center text-theme-text-muted">
                    <span>
                        Source:{' '}
                        <button 
                            onClick={handleAerodromeChange}
                            className="text-theme-brand hover:text-theme-brand-light font-semibold cursor-pointer underline transition-colors font-mono"
                            title="Click to edit ICAO code"
                        >
                            {aerodrome}
                        </button>
                    </span>
                    <span className="text-vs font-semibold uppercase tracking-wider">LATEST UPDATE</span>
                </div>
            </div>
        </div>
    );
}