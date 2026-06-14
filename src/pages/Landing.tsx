import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import PageMeta from '@/util/page-meta';

export default function Landing() {

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            alert(`Logging in with: ${email}`);
        } else {
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            alert(`Registering user: ${name} (${email})`);
        }
    };
 
    return <>
        <PageMeta
            title="SkyDeck | Your All-in-One Study Platform"
            description="SkyDeck is your all-in-one platform for ECQB preparation, flow mastery, and legislative insights. Elevate your performance and stay ahead in the game with our comprehensive tools and resources."
        />

        <div className="min-h-screen flex items-center justify-center bg-theme-bg">
            <div className="p-8 grid grid-cols-2 gap-8 w-full max-w-8xl">
                {/* Left Panel */}
                <div className="w-full text-right flex-col justify-center items-end flex pr-8 border-r border-theme-border">
                    <h1 className="text-6xl font-bold text-theme-text-dark tracking-tight">
                        <span className="text-theme-text-dark text-5xl">Welcome to</span>
                        <span className="text-theme-brand"> SkyDeck</span>
                    </h1>
                    <p className="py-4 text-sm text-theme-text-muted w-3/4 leading-relaxed">
                        Your all-in-one platform for ECQB prep, flow mastery, and legislative insights, designed to elevate your performance and keep you ahead in the game.
                    </p>
                    <div className="flex items-center justify-end gap-4 mt-2">
                        <Link
                            to={"/home"}
                            className="px-6 py-2 bg-theme-brand text-white rounded text-xs font-semibold hover:bg-theme-brand-light cursor-pointer"
                        >
                            Get Started
                        </Link>
                        <a
                            href="#features"
                            className="px-6 py-2 border border-theme-border rounded text-xs font-semibold text-theme-text-dark hover:bg-theme-card transition"
                        >
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full flex items-center justify-start pl-8">
                    <div className="bg-theme-card border border-theme-border rounded-md p-8 max-w-md w-full">
                        {/* Tab Switcher */}
                        <div className="flex bg-theme-bg p-1 rounded mb-6 relative select-none">
                            <button
                                type="button"
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2 text-xs font-semibold rounded transition-all cursor-pointer text-center border border-theme-bg ${
                                    isLogin
                                        ? 'bg-theme-card text-theme-text-dark border-theme-border'
                                        : 'text-theme-text-muted hover:text-theme-text-dark'
                                }`}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2 text-xs font-semibold rounded transition-all cursor-pointer text-center border border-theme-bg ${
                                    !isLogin
                                        ? 'bg-theme-card text-theme-text-dark border-theme-border'
                                        : 'text-theme-text-muted hover:text-theme-text-dark'
                                }`}
                            >
                                Register
                            </button>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-theme-text-dark pb-1">
                            {isLogin ? 'Sign In to SkyDeck' : 'Create an Account'}
                        </h2>
                        <p className="text-xs text-theme-text-muted pb-4">
                            {isLogin ? 'Enter your credentials to access your pilot deck' : 'Sign up to start your pilot training streak'}
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-1">
                                    <label className="text-vs font-medium text-theme-text-muted uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 text-xs rounded border border-theme-border bg-theme-bg text-theme-text-dark focus:outline-none focus:border-theme-brand"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-vs font-medium text-theme-text-muted uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="pilot@skydeck.aero"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-xs rounded border border-theme-border bg-theme-bg text-theme-text-dark focus:outline-none focus:border-theme-brand"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-vs font-medium text-theme-text-muted uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-xs rounded border border-theme-border bg-theme-bg text-theme-text-dark focus:outline-none focus:border-theme-brand"
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="space-y-1">
                                    <label className="text-vs font-medium text-theme-text-muted uppercase tracking-wider">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 text-xs rounded border border-theme-border bg-theme-bg text-theme-text-dark focus:outline-none focus:border-theme-brand"
                                        />
                                    </div>
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex justify-end">
                                    <a href="#forgot" className="text-vs font-medium text-theme-brand hover:text-theme-brand-light transition">
                                        Forgot Password?
                                    </a>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-2 mt-2 bg-theme-brand hover:bg-theme-brand-light text-white text-xs font-semibold rounded flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                <ArrowRight size={14} />
                            </button>
                        </form>

                        {/* Footer Switcher Label */}
                        <div className="text-center mt-6">
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-xs text-theme-text-muted hover:text-theme-text-dark transition cursor-pointer"
                            >
                                {isLogin ? (
                                    <>Don't have an account? <span className="text-theme-brand font-semibold">Sign Up</span></>
                                ) : (
                                    <>Already have an account? <span className="text-theme-brand font-semibold">Sign In</span></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}