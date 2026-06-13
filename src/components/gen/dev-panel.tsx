import { X } from 'lucide-react';

interface DevPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DevPanel({ isOpen, onClose }: DevPanelProps) {
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}>
            {/* Backdrop overlay */}
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black/25 backdrop-blur-xs transition-opacity ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {/* Modal Card */}
            <div className={`relative w-full max-w-md bg-theme-card border border-theme-border rounded shadow-lg overflow-hidden flex flex-col transition-[transform,opacity] will-change-transform ${
                isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-theme-border bg-theme-extra-light">
                    <span className="font-bold text-sm text-theme-text-dark">Developer Panel</span>
                    <button
                        onClick={onClose}
                        className="text-theme-text-muted hover:text-theme-text-main p-1 rounded hover:bg-theme-bg transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="w-full grid grid-cols-2 gap-4 p-4">
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        className="px-4 py-1.5 rounded  font-mono border border-red-300 bg-red-300/25 text-red-500 font-medium cursor-pointer hover:bg-red-300/50 transition-colors w-full"
                    >
                        Clear Local Cache
                    </button>
                </div>
            </div>
        </div>
    );
}
