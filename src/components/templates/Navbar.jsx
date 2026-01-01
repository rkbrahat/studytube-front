import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NeonButton from '../atoms/NeonButton';
import { LayoutDashboard, BookOpen, LogOut, Sun, Moon } from 'lucide-react';
import { ROUTES } from '../../routes';

/**
 * Global Navbar Component
 * 
 * Handles navigation across the entire app.
 * Adapts based on Authentication state.
 * INCLUDES SCROLL EFFECT
 */
const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [scrolled, setScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    React.useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Don't show navbar on CoursePlayer page to keep it "Distraction Free"
    // Hide ONLY if we are deeper than the base list page
    try {
        if (ROUTES && ROUTES.COURSE_PREFIX && ROUTES.COURSES) {
            if (location.pathname.startsWith(ROUTES.COURSE_PREFIX) && location.pathname.length > ROUTES.COURSES.length + 1) return null;
        }
    } catch (e) {
        console.error("Navbar logic error", e);
    }

    return (
        <nav
            className={`fixed flex flex-col top-0 w-full ${mobileMenuOpen ? 'h-full' : scrolled ? 'h-20' : 'h-16'} justify-start z-50 transition-all duration-300
                ${mobileMenuOpen
                    ? 'glass border-b border-white/5 bg-background/90 backdrop-blur-md shadow-lg'
                    : 'bg-transparent border-transparent py-0 md:py-0'}
            `}>

            <div className={`flex flex-row items-center justify-between relative z-[70] px-4 md:px-8 border-0 ${scrolled && !mobileMenuOpen ? 'glass bg-background/90 backdrop-blur-md shadow-lg py-5' : scrolled && mobileMenuOpen ? 'py-5' : !scrolled && mobileMenuOpen ? 'py-5' : 'py-3'} ${mobileMenuOpen ? 'py-3' : ''} transition-all duration-200`}>
                <Link to={ROUTES.HOME} className="text-xl md:text-2xl font-mono font-bold tracking-tighter md:hover:text-primary text-text-main transition-colors uppercase">
                    Study<span className="text-primary">.Tube</span>
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-6">
                    {/* THEME TOGGLE (Desktop) */}
                    {/* THEME TOGGLE (Desktop) */}
                    <div
                        onClick={toggleTheme}
                        className="w-14 h-7 bg-surface/50 border border-text-main/20 rounded-full relative cursor-pointer flex items-center p-1 transition-all hover:border-primary/50 group"
                        title="Toggle Theme"
                    >
                        <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                            className={`w-5 h-5 rounded-full bg-primary flex items-center justify-center text-surface shadow-[0_0_10px_rgb(var(--primary-glow)/0.5)] group-hover:shadow-[0_0_15px_rgb(var(--primary-glow)/0.8)] transition-shadow ${theme === 'dark' ? 'ml-auto' : ''}`}
                        >
                            {theme === 'dark' ? <Moon size={12} className="text-black" /> : <Sun size={12} className="text-black" />}
                        </motion.div>
                    </div>

                    {user ? (
                        <>
                            <Link to={ROUTES.COURSES} className={`text-sm font-medium transition-colors hover:text-text-main ${location.pathname === ROUTES.COURSES ? 'text-primary' : 'text-text-muted'}`}>
                                Protocols
                            </Link>
                            <Link to={ROUTES.DASHBOARD} className={`text-sm font-medium transition-colors hover:text-text-main ${location.pathname === ROUTES.DASHBOARD ? 'text-primary' : 'text-text-muted'}`}>
                                Dashboard
                            </Link>

                            <div className={`h-4 w-px mx-2 transition-colors ${scrolled ? 'bg-text-main/10' : 'bg-text-main/5'}`} />

                            <div className="flex items-center gap-3">
                                <span className="text-xs text-text-muted font-mono">{user.name}</span>
                                <button onClick={logout} className="text-text-muted hover:text-red-400 transition-colors" title="Logout">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to={ROUTES.LOGIN}>
                                <NeonButton variant="secondary" className="px-4 py-1 text-sm">Login</NeonButton>
                            </Link>
                            <Link to={ROUTES.SIGNUP}>
                                <NeonButton variant="primary" className="px-4 py-1 text-sm">Get Started</NeonButton>
                            </Link>
                        </div>
                    )}
                </div>

                {/* MOBILE TOGGLE */}
                <div className="md:hidden flex items-center gap-4">
                    {/* THEME TOGGLE (Mobile Header) */}
                    {/* THEME TOGGLE (Mobile Header) */}
                    <div
                        onClick={toggleTheme}
                        className="w-14 h-7 bg-surface/50 border border-text-main/20 rounded-full relative cursor-pointer flex items-center p-1 transition-all hover:border-primary/50 group"
                    >
                        <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                            className={`w-5 h-5 rounded-full bg-primary flex items-center justify-center text-surface shadow-[0_0_10px_rgb(var(--primary-glow)/0.5)] ${theme === 'dark' ? 'ml-auto' : ''}`}
                        >
                            {theme === 'dark' ? <Moon size={12} className="text-black" /> : <Sun size={12} className="text-black" />}
                        </motion.div>
                    </div>

                    <button
                        className="text-text-main p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <LogOut className="w-6 h-6 rotate-180" /> : <LayoutDashboard className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU OVERLAY */}
            <div className={`inset-0 py-6 z-[80] w-[60vw] transition-transform duration-300 md:hidden
            ${mobileMenuOpen ? 'translate-x-[20vw] flex flex-col items-center justify-center gap-8 shadow-2xl bg-background border-r border-white/5' : 'translate-x-[100vw] hidden'}
            `}>
                {user ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/50 text-primary">
                                <span className="text-xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <p className="text-text-main font-bold">{user.name}</p>
                            <p className="text-xs text-text-muted">{user.email}</p>
                        </div>
                        <Link to={ROUTES.COURSES} className="text-xl font-bold text-text-main hover:text-primary transition-colors">
                            Protocols
                        </Link>
                        <Link to={ROUTES.DASHBOARD} className="text-xl font-bold text-text-main hover:text-primary transition-colors">
                            Dashboard
                        </Link>

                        <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 mt-8">
                            <LogOut className="w-5 h-5" /> Logout
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col gap-6 w-full px-12">
                        <Link to={ROUTES.LOGIN} className="w-full">
                            <NeonButton variant="secondary" className="w-full py-3">Login</NeonButton>
                        </Link>
                        <Link to={ROUTES.SIGNUP} className="w-full">
                            <NeonButton variant="primary" className="w-full py-3">Get Started</NeonButton>
                        </Link>
                    </div>
                )}
            </div>
        </nav >
    );
};

export default Navbar;
