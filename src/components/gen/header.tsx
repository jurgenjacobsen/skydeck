import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header() {
    return (
        <header className="h-14 bg-theme-card border-b border-theme-border flex items-center justify-between px-6 shrink-0 z-10 select-none">
            {/* Path / Section indicator */}
            <Location />

            {/* Search Bar */}
            <SearchBar />

            {/* Right Side Widgets */}
            <div className="flex items-center">
                <Clock />
                <Notifications />
                <User />
            </div>
        </header>
    );
}

function SearchBar() {
    return (
        <div className="relative w-1/4 overflow-hidden">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
                <SearchIcon className="w-4 h-4 text-theme-text-muted" />
            </div>
            <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-22 py-1.5 rounded border border-theme-border bg-theme-bg text-sm focus:outline-none focus:ring-none focus:border-theme-brand transition-all"
            />
            <button className="absolute inset-y-0 right-0 flex items-center rounded m-1 px-4 text-xs text-theme-text-muted hover:text-theme-text-main cursor-pointer hover:bg-theme-extra-light transition-colors border border-transparent hover:border-theme-border">
                CTRL + K
            </button>
        </div>
    )
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
                className="relative mx-4 p-2 rounded-full transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
                aria-label="Notifications"
            >
                <BellIcon size={18} className="text-theme-text-muted hover:text-theme-text-main transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-theme-error text-[9px] font-bold text-white shadow ring-2 ring-white">
                        <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-theme-error opacity-40"></span>
                        <span className="relative">{unreadCount}</span>
                    </span>
                )}
            </button>

            {/* Dropdown Card */}
            <div className={`absolute right-2 top-12 w-md bg-theme-card border border-theme-border rounded shadow z-50 overflow-hidden flex flex-col text-xs transition-all duration-150 ${
                isOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2 pointer-events-none'
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-theme-border bg-theme-extra-light">
                    <div className="font-bold text-theme-text-dark text-sm flex items-center gap-2">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-theme-brand/10 text-theme-brand px-2 py-1 rounded text-xs font-semibold">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-theme-brand hover:text-theme-brand-light font-medium cursor-pointer"
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
                                className={`flex gap-3 px-4 py-3 transition-colors cursor-pointer relative group/item ${
                                    notification.read
                                        ? 'hover:bg-theme-bg'
                                        : 'bg-theme-info-light/30 hover:bg-theme-info-light/50'
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
                                    <div className="flex items-baseline gap-2">
                                        <span
                                            className={`text-sm truncate font-semibold text-theme-text-dark ${
                                                !notification.read ? 'font-bold' : ''
                                            }`}
                                        >
                                            {notification.title} 
                                        </span>
                                        <span className="text-theme-text-muted">
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
                <span className="text-xs uppercase font-bold text-theme-text-muted tracking-wider">LCL</span>
                <span className="text-theme-text-dark font-semibold font-mono tabular-nums">{localTimeStr}</span>
            </div>
            {/* Zulu Time */}
            <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-theme-brand"></span>
                    UTC
                </span>
                <span className="tabular-nums font-mono ">{zuluTimeStr}Z</span>
            </div>
        </div>
    );
}

function User() {
    return (
        <div className="relative group flex items-center gap-3 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-theme-extra-light transition-all group">
            <div className="aspect-square w-8 h-8 rounded bg-theme-info-light flex items-center justify-center font-bold text-xs shadow relative">
                SJ
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-theme-success border-2 border-theme-card"></span>
            </div>
            <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-theme-text-dark leading-tight">
                    Capt. Sarah Jenkins
                </div>
                <div className="text-xs text-theme-text-muted leading-none font-medium mt-0.5 hidden lg:block">
                    A320 Type Rated
                </div>
            </div>
            <div className="hidden lg:block text-theme-text-muted text-xs">
                <ChevronDown className="w-3 h-3 group-hover:transform group-hover:rotate-180 transition-transform duration-300" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-[120%] w-64 bg-theme-card border border-theme-border rounded shadow opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-y-2 group-hover:translate-y-0 transition-all duration-150 z-50 text-sm select-none">
                <div className="px-4 py-2 border-b border-theme-border bg-theme-extra-light">
                    <div className="text-sm font-bold text-theme-text-dark">Sarah Jenkins</div>
                    <div className="text-xs text-theme-text-muted">
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
                    className="flex items-center gap-2 px-4 py-2 text-theme-error hover:bg-theme-error-light transition-colors hover:bg-theme-bg"
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