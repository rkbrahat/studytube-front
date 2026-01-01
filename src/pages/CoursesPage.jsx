import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, BookOpen, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/molecules/CourseCard';
import NeonButton from '../components/atoms/NeonButton';
import { ROUTES } from '../routes';

/**
 * CoursesPage Component
 * 
 * Displays the list of all courses enrolled by the user.
 * Includes filtering and search standard capabilities.
 */
const CoursesPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, completed

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/courses');
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        if (filter === 'all') return true;
        // Logic assumes course has some progress tracking (simplified for now)
        // In real app, we check if all videos are completed
        const isCompleted = course.videos.length > 0 && course.videos.every(v => v.isCompleted);
        if (filter === 'completed') return isCompleted;
        if (filter === 'active') return !isCompleted;
        return true;
    });

    return (
        <div className="min-h-screen bg-background text-text-main p-8 pt-24 font-sans relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main mb-2">My Protocols</h1>
                        <p className="text-text-muted">Access your assigned training modules.</p>
                    </div>
                    <NeonButton onClick={() => navigate(ROUTES.CREATE_COURSE)}>
                        <Plus className="w-4 h-4" /> Initialize New
                    </NeonButton>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-8 bg-surface/50 p-2 rounded-lg backdrop-blur-sm border border-text-main/10 w-fit">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(0,255,157,0.2)]' : 'text-text-muted hover:text-text-main'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'active' ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(0,255,157,0.2)]' : 'text-text-muted hover:text-text-main'}`}
                    >
                        In Progress
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'completed' ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(0,255,157,0.2)]' : 'text-text-muted hover:text-text-main'}`}
                    >
                        Completed
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-surface/50 rounded-xl animate-pulse border border-text-main/5"></div>
                        ))}
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredCourses.map((course, index) => (
                                <CourseCard key={course._id} course={course} index={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface/30 rounded-xl border border-text-main/10 border-dashed">
                        <BookOpen className="w-12 h-12 text-text-main/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-text-main mb-2">No Protocol Found</h3>
                        <p className="text-text-muted mb-6">Initialize a new learning protocol to begin.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CoursesPage;
