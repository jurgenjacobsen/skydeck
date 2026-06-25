import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, ArrowRight, ArrowLeft, Bookmark, Heart, MessageSquare, Send, CheckSquare } from 'lucide-react';
import PageMeta from '@/util/page-meta';

interface Post {
    id: string;
    title: string;
    category: 'Briefing' | 'Exam Prep' | 'SOP' | 'Weather';
    date: string;
    readTime: string;
    author: string;
    authorRole: string;
    excerpt: string;
    content: React.ReactNode;
}

export default function Blog() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [likes, setLikes] = useState<Record<string, number>>({
        'mastering-briefing': 28,
        'ecqb-checkride': 15,
        'memory-flows': 34,
        'metar-decoding': 22,
    });
    const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
    const [activePost, setActivePost] = useState<Post | null>(null);
    
    // Comments state for mock interaction
    const [postComments, setPostComments] = useState<Record<string, { author: string; date: string; text: string }[]>>({
        'mastering-briefing': [
            { author: 'FirstOfficer_Sky', date: 'June 24, 2026', text: 'Excellent guide! The weather threat modeling section is gold.' },
            { author: 'SimFlyer88', date: 'June 25, 2026', text: 'Do you have a templates folder for threat mitigations?' }
        ]
    });
    const [newCommentName, setNewCommentName] = useState('');
    const [newCommentText, setNewCommentText] = useState('');

    // Load bookmarks on mount
    useEffect(() => {
        const stored = localStorage.getItem('skydeck_blog_bookmarks');
        if (stored) {
            try {
                setBookmarks(JSON.parse(stored));
            } catch (e) {
                // ponytail: silent fail on malformed JSON
            }
        }
    }, []);

    // Save bookmarks
    const toggleBookmark = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        let updated: string[];
        if (bookmarks.includes(id)) {
            updated = bookmarks.filter(b => b !== id);
        } else {
            updated = [...bookmarks, id];
        }
        setBookmarks(updated);
        localStorage.setItem('skydeck_blog_bookmarks', JSON.stringify(updated));
    };

    // Toggle Likes
    const toggleLike = (id: string) => {
        const liked = hasLiked[id];
        setHasLiked(prev => ({ ...prev, [id]: !liked }));
        setLikes(prev => ({
            ...prev,
            [id]: liked ? prev[id] - 1 : prev[id] + 1
        }));
    };

    // Add Comment
    const handleAddComment = (postId: string, e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        const commentAuthor = newCommentName.trim() || 'Anonymous Aviator';
        const newComment = {
            author: commentAuthor,
            date: 'Just now',
            text: newCommentText.trim()
        };

        setPostComments(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), newComment]
        }));

        setNewCommentText('');
        // ponytail: reset inputs simply
    };

    const categories = ['All', 'Briefing', 'Exam Prep', 'SOP', 'Weather'];

    const blogPosts: Post[] = [
        {
            id: 'mastering-briefing',
            title: 'Mastering the Pre-Flight Briefing: Weather, Threats, and Fuel Planning',
            category: 'Briefing',
            date: 'June 24, 2026',
            readTime: '8 min read',
            author: 'Capt. Sarah Jenkins',
            authorRole: 'A320 Line Check Captain',
            excerpt: 'A deep dive into how professional virtual pilots compile threat mitigations and ingest live METAR/TAF feeds for seamless simulator operations.',
            content: (
                <div className="space-y-4 text-theme-text-main leading-relaxed">
                    <p>
                        A successful flight is won or lost before the engines even start. In professional airline operations, the pre-flight briefing isn't just a regulatory formality—it's a critical safety barrier designed to anticipate threat vectors and build robust mitigations.
                    </p>
                    
                    <h3 className="text-sm font-bold text-theme-text-dark mt-6 mb-2">1. Ingesting and Decoding Live Weather Feeds</h3>
                    <p>
                        Before looking at your flight plan, look at the weather. Check both METARs for current conditions and TAFs for forecast changes during your scheduled arrival window. Pay close attention to wind velocity components:
                    </p>
                    <div className="bg-theme-extra-light border border-theme-border rounded p-4 my-3 font-mono text-xs text-theme-text-dark">
                        EGLL 251750Z 24012KT 9999 FEW025 21/14 Q1013 NOSIG
                        <br />
                        <span className="text-theme-brand text-[11px] font-sans block mt-2">
                            Interpretation: London Heathrow, 25th day at 17:50Z. Wind 240 degrees at 12 knots. Visibility 10km+, few clouds at 2,500ft. Temp 21°C, dewpoint 14°C. QNH 1013 hPa. No significant change expected.
                        </span>
                    </div>

                    <h3 className="text-sm font-bold text-theme-text-dark mt-6 mb-2">2. Threat & Error Management (TEM)</h3>
                    <p>
                        Categorize threats into environmental (e.g., active thunderstorms, short runways, high terrain) and organizational (e.g., dispatch delays, maintenance issues). For every threat, establish a clear mitigation:
                    </p>
                    <div className="bg-theme-extra-light border-l-4 border-theme-brand rounded-r p-4 my-3">
                        <strong className="text-theme-text-dark text-xs block mb-1">Example Mitigation Strategy:</strong>
                        <ul className="list-disc pl-4 space-y-1 text-xs">
                            <li><strong>Threat:</strong> Forecast windshear on final approach (EGLL TAF WS020).</li>
                            <li><strong>Mitigation:</strong> Increase approach speed margin (Vapp + 5kts), brief go-around procedures, select Flaps 3 for landing instead of Full for better go-around performance.</li>
                        </ul>
                    </div>

                    <h3 className="text-sm font-bold text-theme-text-dark mt-6 mb-2">3. Fuel Policy Optimization</h3>
                    <p>
                        Don't just upload standard fuel blocks. Analyze hold times, route deviations, and weather contingencies. For jet transports, remember:
                    </p>
                    <div className="border border-theme-border rounded overflow-hidden mt-4">
                        <table className="min-w-full text-xs text-left">
                            <thead className="bg-theme-extra-light text-theme-text-dark border-b border-theme-border font-semibold">
                                <tr>
                                    <th className="p-3">Fuel Segment</th>
                                    <th className="p-3">Calculation Basis</th>
                                    <th className="p-3">Typical Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-theme-border">
                                <tr>
                                    <td className="p-3 font-semibold">Contingency Fuel</td>
                                    <td className="p-3">5% of Trip Fuel or 5-min holding</td>
                                    <td className="p-3">Covers route deviations</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-semibold">Final Reserve</td>
                                    <td className="p-3">30-min holding at 1,500ft above alternate</td>
                                    <td className="p-3">Absolutely untouchable before landing</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-semibold">Extra Fuel</td>
                                    <td className="p-3">Captain's discretion</td>
                                    <td className="p-3">Add when holding is expected at destination</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        },
        {
            id: 'ecqb-checkride',
            title: 'Ace Your Next ECQB Virtual Checkride: High-Yield Preparation',
            category: 'Exam Prep',
            date: 'June 18, 2026',
            readTime: '6 min read',
            author: 'David Vance',
            authorRole: 'SOP Flight Instructor',
            excerpt: 'Struggling with EASA regulations or theoretical checkrides? Here is a breakdown of the highest-yield subjects and active recall strategies.',
            content: (
                <div className="space-y-4 text-theme-text-main leading-relaxed">
                    <p>
                        The European Central Question Bank (ECQB) can feel like an insurmountable wall of rote memorization. However, virtual pilots and real students alike can pass with flying colors by organizing their study sessions around high-yield aviation regulations.
                    </p>
                    
                    <h3 className="text-sm font-bold text-theme-text-dark mt-6 mb-2">Key Areas of Focus</h3>
                    <ul className="list-decimal pl-5 space-y-2">
                        <li>
                            <strong>EASA Part-FCL.025:</strong> Understanding exam validity rules. Once you attempt your first theoretical knowledge subject, you have exactly 18 months to complete all remaining exams. The passed exams remain valid for 36 months toward licensing.
                        </li>
                        <li>
                            <strong>Altimeter Settings:</strong> Transition Altitude vs. Transition Level. Make sure you memorize QNH vs. Standard Pressure (1013.25 hPa / 29.92 inHg). Remember: <em>"On climb through transition altitude, set standard. On descent through transition level, set local QNH."</em>
                        </li>
                        <li>
                            <strong>Right-of-Way Rules (ICAO Annex 2):</strong> When two aircraft are converging at approximately the same level, the aircraft that has the other on its right shall give way. An aircraft that is being overtaken has the right of way, and the overtaking aircraft must alter its course to the right.
                        </li>
                    </ul>

                    <h3 className="text-sm font-bold text-theme-text-dark mt-6 mb-2">Active Recall Strategy</h3>
                    <p>
                        Don't just re-read study guides. Use active recall by building mock exam scenarios. Test your knowledge on EASA Class 1 Medical validity ranges:
                    </p>
                    <div className="bg-theme-extra-light border border-theme-border rounded p-4 my-2 text-xs">
                        <strong>Quick Medical Validity Check:</strong>
                        <ul className="list-disc pl-4 mt-2 space-y-1">
                            <li><strong>Under 40:</strong> Valid for 12 months.</li>
                            <li><strong>Over 40 (Commercial/Single-Pilot):</strong> Valid for 6 months.</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: 'memory-flows',
            title: 'Memory Flows vs. Checklists: Safety in Cockpit Muscle Memory',
            category: 'SOP',
            date: 'June 10, 2026',
            readTime: '5 min read',
            author: 'Marc Dubois',
            authorRole: 'Type Rating Instructor',
            excerpt: 'Why memorizing your cockpit startup flows is critical before reaching for the checklist, and how to practice them effectively.',
            content: (
                <div className="space-y-4 text-theme-text-main leading-relaxed">
                    <p>
                        A common mistake among student pilots and flight simulator enthusiasts is using the checklist as a step-by-step instruction manual. This is a fundamental misunderstanding of Standard Operating Procedures (SOP).
                    </p>
                    
                    <h3 className="text-sm font-bold text-theme-text-dark mt-6 mb-2">Flows First, Checklists Second</h3>
                    <p>
                        A <strong>Flow</strong> is a sequential action pattern performed from memory. It follows a logical path across the cockpit panels (e.g., from the bottom pedestal, up to the main panel, and ending on the overhead panel).
                    </p>
                    <p>
                        A <strong>Checklist</strong> is a safety net. It is read *after* the flow is complete to verify that safety-critical items were performed correctly. You should never do an action *because* of a checklist unless it's a specific read-and-do checklist (like an emergency checklist).
                    </p>

                    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded p-4 my-3 text-xs flex gap-3">
                        <CheckSquare className="w-5 h-5 shrink-0 text-amber-700" />
                        <div>
                            <strong>SOP Checklist Discipline Rule:</strong>
                            <p className="mt-1">
                                Never initiate a flow while the aircraft is in motion unless specified by memory items (e.g. Engine Fire). Maintain absolute quiet and focus during the challenge-response checklist reading.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-theme-text-dark mt-6 mb-2">How to Practice Your Flows</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>"Paper Tiger" Cockpit:</strong> Print a high-resolution poster of your aircraft overhead panel. Sit in front of it and practice touching the buttons in order while saying the actions out loud.</li>
                        <li><strong>Standardized Flow Paths:</strong> Stick to the same path. For example, in the A320, the Cockpit Preparation flow starts at the overhead panel, moves left-to-right, then down to the glare shield, main panel, pedestal, and finishes at the FMGS.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'metar-decoding',
            title: 'Advanced Weather Decoding: Going Beyond Basic METARs',
            category: 'Weather',
            date: 'May 29, 2026',
            readTime: '7 min read',
            author: 'Capt. Sarah Jenkins',
            authorRole: 'A320 Line Check Captain',
            excerpt: 'An advanced guide to reading weather reports. Learn to decode wind shear warnings, trend forecasts, and auto-observations.',
            content: (
                <div className="space-y-4 text-theme-text-main leading-relaxed">
                    <p>
                        Most pilots know how to read temperature, wind, and basic clouds in a METAR. But when bad weather hits, the comments and trend sections contain critical details that can change your flight strategy.
                    </p>

                    <h3 className="text-sm font-bold text-theme-text-dark mt-6 mb-2">1. Wind Shear Warnings (WS)</h3>
                    <p>
                        If you see <code>WS R24L</code> in a METAR, it indicates Wind Shear has been reported on runway 24 Left. This is a critical safety threat. It means you must expect sudden airspeed gains or losses on final approach.
                    </p>

                    <h3 className="text-sm font-bold text-theme-text-dark mt-6 mb-2">2. Trend Forecasts (TEMPO, BECMG)</h3>
                    <p>
                        Located at the end of some military and international METARs, trends are highly accurate short-term forecasts valid for 2 hours:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>TEMPO:</strong> Temporary fluctuations lasting less than 1 hour in each instance and covering less than half of the period.</li>
                        <li><strong>BECMG:</strong> A regular, gradual change to new conditions over the specified time range.</li>
                    </ul>

                    <h3 className="text-sm font-bold text-theme-text-dark mt-6 mb-2">3. Decoding Complex Identifiers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                        <div className="bg-theme-extra-light p-3 rounded border border-theme-border text-xs">
                            <strong className="text-theme-text-dark block mb-1">RA / DZ / SN</strong>
                            Rain, Drizzle, and Snow. Look for modifiers: <code>+RA</code> (Heavy Rain), <code>-DZ</code> (Light Drizzle).
                        </div>
                        <div className="bg-theme-extra-light p-3 rounded border border-theme-border text-xs">
                            <strong className="text-theme-text-dark block mb-1">FG / BR / HZ</strong>
                            Fog (visibility &lt; 1km), Mist (visibility 1km - 5km), and Haze.
                        </div>
                        <div className="bg-theme-extra-light p-3 rounded border border-theme-border text-xs">
                            <strong className="text-theme-text-dark block mb-1">TS / SH / CB</strong>
                            Thunderstorm, Showers, and Cumulonimbus (the only cloud type explicitly identified in standard METARs).
                        </div>
                        <div className="bg-theme-extra-light p-3 rounded border border-theme-border text-xs">
                            <strong className="text-theme-text-dark block mb-1">CAVOK</strong>
                            Clouds and Visibility OK. Indicates visibility &ge; 10km, no cloud below 5,000ft (or minimum sector altitude), and no significant weather.
                        </div>
                    </div>
                </div>
            )
        }
    ];

    // Filters & Search
    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              post.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const featuredPost = blogPosts[0];
    const secondaryPosts = filteredPosts.filter(p => p.id !== featuredPost.id || selectedCategory !== 'All');

    return (
        <div className="space-y-6">
            <PageMeta 
                title={activePost ? `${activePost.title} - Skydeck Blog` : "Skydeck - Blog"}
                description={activePost ? activePost.excerpt : "Expert aviation training guides, checklist memory flows, meteorological decoding, and simulator checkride guides."}
                ogType={activePost ? 'article' : 'website'}
            />

            {/* Header section */}
            {!activePost ? (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-lg font-bold text-theme-text-dark tracking-tight">
                            Blog
                        </h1>
                        <p className="text-theme-text-main text-xs mt-1">
                            Technical briefings, SOP walkthroughs, and training insights for virtual captains.
                        </p>
                    </div>
                    {bookmarks.length > 0 && (
                        <div className="bg-theme-brand/10 border border-theme-brand/20 text-theme-brand text-vs font-semibold uppercase tracking-wider px-3 py-1.5 rounded">
                            {bookmarks.length} Bookmarked Article{bookmarks.length > 1 ? 's' : ''} Saved
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <button
                        onClick={() => {
                            setActivePost(null);
                            // ponytail: Reset comment forms simply
                            setNewCommentName('');
                            setNewCommentText('');
                        }}
                        className="inline-flex items-center gap-2 text-theme-text-muted hover:text-theme-brand text-xs font-semibold transition-colors group"
                        id="btn-back-to-blog"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Articles
                    </button>
                </div>
            )}

            {/* Immersive Reader Mode */}
            {activePost ? (
                <article className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left main content column */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-theme-card border border-theme-border rounded overflow-hidden shadow">
                            {/* Heading Header */}
                            <div className="p-6 md:p-8 border-b border-theme-border">
                                <div className="flex flex-wrap items-center gap-4 text-xs mb-4">
                                    <span className="bg-theme-brand/10 text-theme-brand px-4 py-1 rounded font-semibold">
                                        {activePost.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-theme-text-muted">
                                        <Calendar className="w-4 h-4" />
                                        {activePost.date}
                                    </span>
                                    <span className="flex items-center gap-1 text-theme-text-muted">
                                        <Clock className="w-4 h-4" />
                                        {activePost.readTime}
                                    </span>
                                </div>
                                <h1 className="text-xl md:text-2xl font-bold text-theme-text-dark tracking-tight leading-tight">
                                    {activePost.title}
                                </h1>

                                {/* Author info */}
                                <div className="flex items-center gap-3 mt-6">
                                    <div className="w-8 h-8 rounded-full bg-theme-brand text-white flex items-center justify-center font-bold text-sm">
                                        {activePost.author[0]}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-theme-text-dark">{activePost.author}</div>
                                        <div className="text-vs text-theme-text-muted">{activePost.authorRole}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Longform content */}
                            <div className="p-6 md:p-8" id="article-body">
                                {activePost.content}
                            </div>

                            {/* Article actions & reactions */}
                            <div className="px-6 py-4 bg-theme-extra-light border-t border-theme-border flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <button 
                                        onClick={() => toggleLike(activePost.id)}
                                        className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                                            hasLiked[activePost.id] ? 'text-red-500' : 'text-theme-text-muted hover:text-red-500'
                                        }`}
                                        id={`btn-like-${activePost.id}`}
                                    >
                                        <Heart className={`w-4 h-4 ${hasLiked[activePost.id] ? 'fill-red-500 stroke-red-500' : ''}`} />
                                        {likes[activePost.id]} Likes
                                    </button>
                                    <div className="flex items-center gap-2 text-xs text-theme-text-muted">
                                        <MessageSquare className="w-4 h-4" />
                                        {postComments[activePost.id]?.length || 0} Comments
                                    </div>
                                </div>

                                <button 
                                    onClick={(e) => toggleBookmark(activePost.id, e)}
                                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                                        bookmarks.includes(activePost.id) ? 'text-theme-brand' : 'text-theme-text-muted hover:text-theme-brand'
                                    }`}
                                    id={`btn-bookmark-active-${activePost.id}`}
                                >
                                    <Bookmark className={`w-4 h-4 ${bookmarks.includes(activePost.id) ? 'fill-theme-brand' : ''}`} />
                                    {bookmarks.includes(activePost.id) ? 'Saved' : 'Bookmark'}
                                </button>
                            </div>
                        </div>

                        {/* Interactive Mock Comments Section */}
                        <div className="bg-theme-card border border-theme-border rounded p-6 shadow space-y-6">
                            <h2 className="text-sm font-bold text-theme-text-dark pb-4">
                                Discussion ({postComments[activePost.id]?.length || 0})
                            </h2>

                            {/* Input Form */}
                            <form onSubmit={(e) => handleAddComment(activePost.id, e)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Your Name (Optional)" 
                                        value={newCommentName}
                                        onChange={(e) => setNewCommentName(e.target.value)}
                                        className="bg-theme-bg border border-theme-border rounded p-2 text-xs focus:outline-none focus:border-theme-brand"
                                        id="input-comment-author"
                                    />
                                </div>
                                <div className="relative">
                                    <textarea 
                                        rows={3} 
                                        placeholder="Add to the briefing discussion..." 
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                        className="w-full bg-theme-bg border border-theme-border rounded p-3 text-xs focus:outline-none focus:border-theme-brand resize-none"
                                        required
                                        id="input-comment-text"
                                    />
                                    <button 
                                        type="submit" 
                                        className="absolute bottom-3 right-3 bg-theme-brand hover:bg-theme-brand-light text-white p-1.5 rounded transition-colors"
                                        id="btn-submit-comment"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </form>

                            {/* List comments */}
                            <div className="space-y-4 pt-2">
                                {postComments[activePost.id]?.length ? (
                                    postComments[activePost.id].map((comment, index) => (
                                        <div key={index} className="border-t border-theme-border pt-4 text-xs">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-theme-text-dark">{comment.author}</span>
                                                <span className="text-vs text-theme-text-muted">{comment.date}</span>
                                            </div>
                                            <p className="text-theme-text-main leading-relaxed">{comment.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-theme-text-muted italic pt-2">
                                        No comments yet. Start the pre-flight discussion!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right side information column */}
                    <div className="space-y-6">
                        <div className="bg-theme-card border border-theme-border rounded p-6 shadow">
                            <h3 className="text-xs font-bold text-theme-text-dark uppercase tracking-wider mb-4">
                                Author Profile
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-theme-brand text-white flex items-center justify-center font-bold text-base mt-4">
                                        {activePost.author[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-theme-text-dark">{activePost.author}</h4>
                                        <p className="text-vs text-theme-text-muted">{activePost.authorRole}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-theme-text-main pt-4 border-t border-theme-border leading-relaxed">
                                    Contributing Flight Safety officer at Skydeck. Specializes in multi-crew cooperation (MCC) and advanced instrument flight procedures.
                                </p>
                            </div>
                        </div>

                        {/* Read Next Sidebar */}
                        <div className="bg-theme-card border border-theme-border rounded p-5 shadow space-y-4">
                            <h3 className="text-xs font-bold text-theme-text-dark uppercase tracking-wider">
                                Related Briefings
                            </h3>
                            <div className="space-y-4 mt-4">
                                {blogPosts.filter(p => p.id !== activePost.id).slice(0, 2).map(post => (
                                    <div 
                                        key={post.id}
                                        onClick={() => {
                                            setActivePost(post);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="cursor-pointer group block"
                                    >
                                        <span className="text-vs font-semibold text-theme-brand uppercase tracking-wider block mb-1">
                                            {post.category}
                                        </span>
                                        <h4 className="text-xs font-bold text-theme-text-dark group-hover:text-theme-brand transition-colors line-clamp-2">
                                            {post.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-2 text-vs text-theme-text-muted">
                                            <span>{post.date}</span>
                                            <span>•</span>
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            ) : (
                <>
                    {/* Search & Category filter panel */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-theme-card border border-theme-border rounded p-4 shadow">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-theme-text-muted" />
                            <input
                                type="text"
                                placeholder="Search articles, SOP guides, authors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-theme-bg border border-theme-border rounded py-2 pl-10 pr-4 text-xs text-theme-text-dark focus:outline-none focus:border-theme-brand"
                                id="input-blog-search"
                            />
                        </div>

                        {/* Categories pills */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-1 rounded text-xs font-medium ${
                                        selectedCategory === category
                                            ? 'bg-theme-brand text-white'
                                            : 'bg-theme-bg text-theme-text-main border border-theme-border hover:bg-theme-hover'
                                    }`}
                                    id={`tab-category-${category.toLowerCase().replace(' ', '-')}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Featured Article - only show if search query is empty and category is 'All' or 'Briefing' */}
                    {searchQuery === '' && (selectedCategory === 'All' || selectedCategory === 'Briefing') && (
                        <div 
                            onClick={() => setActivePost(featuredPost)}
                            className="group cursor-pointer bg-theme-card border border-theme-border rounded overflow-hidden flex flex-col lg:flex-row shadow hover:border-theme-brand/40 transition-[border-color] duration-200"
                            id={`article-card-${featuredPost.id}`}
                        >
                            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-xs">
                                        <span className="bg-theme-brand/10 text-theme-brand px-4 py-1 rounded font-semibold uppercase">
                                            Featured {featuredPost.category}
                                        </span>
                                        <span className="text-theme-text-muted">•</span>
                                        <span className="text-theme-text-muted">{featuredPost.readTime}</span>
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-theme-text-dark">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-theme-text-main text-xs leading-relaxed line-clamp-3">
                                        {featuredPost.excerpt}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-theme-border-soft">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-theme-brand text-white flex items-center justify-center font-bold text-xs">
                                            {featuredPost.author[0]}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-theme-text-dark">{featuredPost.author}</div>
                                            <div className="text-vs text-theme-text-muted">{featuredPost.authorRole}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={(e) => toggleBookmark(featuredPost.id, e)}
                                            className={`p-1.5 rounded border border-theme-border hover:bg-theme-bg transition-colors ${
                                                bookmarks.includes(featuredPost.id) ? 'text-theme-brand' : 'text-theme-text-muted'
                                            }`}
                                            title="Bookmark"
                                        >
                                            <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(featuredPost.id) ? 'fill-theme-brand' : ''}`} />
                                        </button>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-brand group-hover:translate-x-1 transition-transform">
                                            Read Article
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Secondary Articles list/grid */}
                    {secondaryPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {secondaryPosts.map((post) => (
                                <div
                                    key={post.id}
                                    onClick={() => setActivePost(post)}
                                    className="group cursor-pointer bg-theme-card border border-theme-border rounded overflow-hidden flex flex-col justify-between shadow hover:border-theme-brand/40 hover:-translate-y-0.5 transition-[border-color,transform] duration-200"
                                    id={`article-card-${post.id}`}
                                >
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="bg-theme-extra-light text-theme-text-muted px-2 py-0.5 rounded border border-theme-border">
                                                {post.category}
                                            </span>
                                            <span className="text-theme-text-muted">{post.readTime}</span>
                                        </div>
                                        <h3 className="text-xs font-bold text-theme-text-dark group-hover:text-theme-brand transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-theme-text-main text-[11px] leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                    <div className="px-5 py-4 bg-theme-extra-light border-t border-theme-border flex items-center justify-between">
                                        <span className="text-vs text-theme-text-muted">
                                            By {post.author}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={(e) => toggleBookmark(post.id, e)}
                                                className={`p-1 rounded transition-colors ${
                                                    bookmarks.includes(post.id) ? 'text-theme-brand' : 'text-theme-text-muted hover:text-theme-brand'
                                                }`}
                                            >
                                                <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(post.id) ? 'fill-theme-brand' : ''}`} />
                                            </button>
                                            <ArrowRight className="w-3.5 h-3.5 text-theme-text-muted group-hover:text-theme-brand group-hover:translate-x-0.5 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-theme-card border border-theme-border rounded p-12 text-center shadow">
                            <p className="text-xs text-theme-text-muted italic">
                                No articles matched your search or category filter. Try refining your parameters.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}