import { useState, useEffect } from 'react';
import { BookOpenIcon, FileTextIcon, GraduationCapIcon, HomeIcon, NewspaperIcon, WorkflowIcon } from "lucide-react";
import { Link } from "react-router-dom";

import packageJson from '../../../package.json';

const links = [
    { name: 'Home', icon: HomeIcon, path: '/home' },
    { name: 'Q-Bank', icon: GraduationCapIcon, path: '/qbank' },
    { name: 'Legislation', icon: BookOpenIcon, path: '/legislation' },
    { name: 'Flows Trainer', icon: WorkflowIcon, path: '/flows' },
    { name: 'Flight Briefing', icon: FileTextIcon, path: '/briefing' },
    { name: 'Blog', icon: NewspaperIcon, path: '/blog' },
]

export default function Sidebar() {
    return (
        <aside className="w-72 bg-theme-card border-r border-theme-border flex flex-col justify-between shrink-0 select-none">
            <div>
                <div className="h-14 border-b border-theme-border flex items-center justify-center font-bold text-lg">
                    SKYDECK
                </div>
                <div className="p-4 text-sm flex-col gap-1 flex">
                    {links.map((link, key) => (
                        <Link
                            to={link.path}
                            className="flex items-center gap-3 py-2 px-4 rounded font-medium hover:bg-theme-bg transition-all"
                            key={key}
                        >
                            <link.icon size={18} className="text-theme-text-muted"/>
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="p-4 border-t border-theme-border flex flex-col items-center gap-4">
                <Status /> 
                <VersionInfo />
            </div>
        </aside>
    );
}

function getSystemStatus() {
    const minutes = new Date().getMinutes();
    const cycleMinute = minutes % 25;

    if (cycleMinute < 10) {
        return {
            type: 'online',
            color: 'bg-green-500',
            text: 'All systems operational'
        };
    } else if (cycleMinute < 20) {
        return {
            type: 'parcial',
            color: 'bg-amber-500',
            text: 'Partial system degradation'
        };
    } else {
        return {
            type: 'degraded',
            color: 'bg-red-500',
            text: 'System status degraded'
        };
    }
}

function Status() {
    const [status, setStatus] = useState(() => getSystemStatus());

    useEffect(() => {
        const interval = setInterval(() => {
            setStatus(getSystemStatus());
        }, 1000); // Update every second to reflect real-time minute transitions
        return () => clearInterval(interval);
    }, []);

    if (!status) return null;
    if (status.type === 'online') return null; // Don't show anything if all systems are operational

    return (
        <div className="flex items-center gap-2 bg-theme-bg px-4 py-2 rounded border border-theme-border">
            <div className={"w-2 h-2 rounded-full " + status.color}>
                <div className={"motion-safe:animate-ping-slow w-2 h-2 rounded-full " + status.color}/>
            </div>
            <span className="text-xs text-theme-text-secondary">{status.text}</span>
        </div>
    );
}

function VersionInfo() {
    return (
        <div className="text-theme-text-muted text-xs">
            Version {packageJson.version}
        </div>
    );
}