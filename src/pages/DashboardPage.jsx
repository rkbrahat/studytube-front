import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NeonButton from '../components/atoms/NeonButton';
import { Play, Award, Clock, BookOpen, ArrowRight, User, Plus } from 'lucide-react';
import { ROUTES } from '../routes';

/**
 * DashboardPage Component
 * 
 * NEW ROLE: User Hub / Stats Center
 * - Displays User Profile Info
 * - Displays Learning Statistics
 * - Shows "Continue Learning" (Last active course)
 * - Navigation to "My Courses"
 */
const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalCourses: 0,
        completedCourses: 0,
        hoursLearned: 0,
        lastCourse: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all courses to calculate stats
                const { data: courses } = await api.get('/courses');

                const completed = courses.filter(c => c.videos.length > 0 && c.videos.every(v => v.isCompleted)).length;

                // Helper to parse "MM:SS" or "HH:MM:SS" to seconds
                const parseDuration = (str) => {
                    if (!str) return 0;
                    const parts = str.split(':').map(Number);
                    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
                    if (parts.length === 2) return parts[0] * 60 + parts[1];
                    return 0;
                };

                // Find the first "In Progress" course or just the first course as a fallback
                const lastCourse = courses.find(c => c.videos.some(v => !v.isCompleted)) || courses[0];

                // Calculate weighted hours based on course completion percentage
                const totalSecondsWatched = courses.reduce((acc, course) => {
                    if (!course.videos || course.videos.length === 0) return acc;

                    // 1. Total Duration of the Protocol
                    const protocolTotalSeconds = course.videos.reduce((sum, v) => sum + parseDuration(v.duration || "00:00"), 0);

                    // 2. Completion Percentage (based on count)
                    const completedCount = course.videos.filter(v => v.isCompleted).length;
                    const completionRatio = completedCount / course.videos.length;

                    // 3. Estimated Time Spent
                    return acc + (protocolTotalSeconds * completionRatio);
                }, 0);

                const totalHours = (totalSecondsWatched / 3600).toFixed(1);

                setStats({
                    totalCourses: courses.length,
                    completedCourses: completed,
                    hoursLearned: totalHours,
                    lastCourse
                });

            } catch (error) {
                console.error("Dashboard Load Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-background text-text-main p-8 pt-24 font-sans relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-text-main mb-2">
                        Welcome back, <span className="text-primary">{user?.name}</span>
                    </h1>
                    <p className="text-text-muted text-lg">Your neural training hub is ready.</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* STATS COLUMN */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 3-Card Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <motion.div variants={itemVariants} className="glass p-6 rounded-xl border border-text-main/10 bg-surface/40 hover:bg-surface/60 transition-colors">
                                <div className="flex items-center gap-3 mb-2 text-primary">
                                    <BookOpen className="w-6 h-6" />
                                    <span className="font-mono text-sm uppercase tracking-wider">Protocols</span>
                                </div>
                                <h3 className="text-3xl font-bold text-text-main">{stats.totalCourses}</h3>
                                <p className="text-xs text-text-muted mt-1">Active Enrollments</p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="glass p-6 rounded-xl border border-purple-500/20 bg-surface/40 hover:bg-surface/60 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                <div className="flex items-center gap-3 mb-2 text-purple-500">
                                    <Award className="w-6 h-6" />
                                    <span className="font-mono text-sm uppercase tracking-wider">Mastery</span>
                                </div>
                                <h3 className="text-3xl font-bold text-text-main">{stats.completedCourses}</h3>
                                <p className="text-xs text-text-muted mt-1">Completed Modules</p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="glass p-6 rounded-xl border border-text-main/10 bg-surface/40 hover:bg-surface/60 transition-colors">
                                <div className="flex items-center gap-3 mb-2 text-yellow-500">
                                    <Clock className="w-6 h-6" />
                                    <span className="font-mono text-sm uppercase tracking-wider">Hours</span>
                                </div>
                                <h3 className="text-3xl font-bold text-text-main">{stats.hoursLearned}h</h3>
                                <p className="text-xs text-text-muted mt-1">Total Focus Time</p>
                            </motion.div>
                        </div>

                        {/* CONTINUE LEARNING CARD */}
                        {stats.lastCourse ? (
                            <motion.div variants={itemVariants} className="glass p-8 rounded-xl border border-primary/20 bg-gradient-to-r from-surface/80 to-surface/40 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <div className="flex items-center gap-2 text-primary mb-2">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            <span className="text-xs font-mono uppercase tracking-widest">Continue Training</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-text-main mb-2">{stats.lastCourse.title}</h2>
                                        <div className="flex items-center gap-4 text-sm text-text-muted">
                                            <span>{stats.lastCourse.videos.length} Modules</span>
                                            <span className="w-1 h-1 bg-text-main/20 rounded-full" />
                                            <span>Next: Module {stats.lastCourse.videos.findIndex(v => !v.isCompleted) + 1 || 1}</span>
                                        </div>
                                    </div>
                                    <NeonButton onClick={() => navigate(ROUTES.COURSE_LINK(stats.lastCourse.slug || stats.lastCourse._id))}>
                                        <Play className="w-4 h-4 mr-2" /> Resume
                                    </NeonButton>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div variants={itemVariants} className="glass p-4 rounded-xl border border-text-main/10 border-dashed flex flex-col items-center justify-center text-center py-12">
                                <BookOpen className="w-12 h-12 text-text-main/10 mb-4" />
                                <h3 className="text-lg font-bold text-text-main mb-2">No Active Protocols</h3>
                                <NeonButton variant="primary" className="px-4 py-2 text-xs" onClick={() => navigate(ROUTES.CREATE_COURSE)}>
                                    <Plus className="w-3 h-3" />
                                    Initialize First Protocol
                                </NeonButton>
                            </motion.div>
                        )}

                    </div>

                    {/* PROFILE / ACTIONS COLUMN */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        {/* User Profile Card */}
                        <div className="glass p-6 rounded-xl border border-text-main/10 bg-surface/60">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                    <User className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-main">{user?.name}</h3>
                                    <p className="text-xs text-text-muted break-all">{user?.email}</p>
                                    <div className="mt-2 text-xs font-mono text-primary px-2 py-1 bg-primary/10 rounded border border-primary/10 inline-block">
                                        LEVEL: STUDENT
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-px bg-text-main/5 mb-6" />
                            <NeonButton variant="secondary" className="w-full justify-between group" onClick={() => navigate(ROUTES.COURSES)}>
                                View All Protocols <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </NeonButton>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass p-6 rounded-xl border border-text-main/10 bg-surface/60">
                            <h4 className="text-sm font-mono font-bold text-text-muted uppercase tracking-wider mb-4">Quick Actions</h4>
                            <div className="space-y-3">
                                <button onClick={() => navigate(ROUTES.CREATE_COURSE)} className="w-full text-left p-3 rounded-lg bg-text-main/5 hover:bg-text-main/10 transition-colors text-sm text-text-main flex items-center gap-3 border border-text-main/5 hover:border-text-main/20">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Plus className="w-4 h-4" /></div>
                                    <span>Initialize New Protocol</span>
                                </button>
                                <button className="w-full text-left p-3 rounded-lg bg-text-main/5 hover:bg-text-main/10 transition-colors text-sm text-text-main flex items-center gap-3 border border-text-main/5 hover:border-text-main/20">
                                    <div className="w-8 h-8 rounded-full bg-text-main/10 flex items-center justify-center text-text-main"><Award className="w-4 h-4" /></div>
                                    <span>View Certificates</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>

            </div>
        </div>
    );
};

export default DashboardPage;
