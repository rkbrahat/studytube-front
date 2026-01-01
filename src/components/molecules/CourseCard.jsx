import React from 'react';
import { motion } from 'framer-motion';
import { Lock, PlayCircle, BookOpen } from 'lucide-react';
import { ROUTES } from '../../routes';

import { Link } from 'react-router-dom';
import StatusBadge from '../atoms/StatusBadge';

// ... (imports remain)

const CourseCard = ({ course }) => {
    return (
        // Link Wrapper: Makes the whole card clickable
        <Link to={ROUTES.COURSE_LINK(course.slug || course._id)} className="block w-full h-full">
            <motion.div
                whileHover={{ y: -5 }} // Slight lift effect on hover
                className="glass rounded-xl p-5 border border-white/5 hover:border-primary/50 transition-all duration-300 flex flex-col gap-4 w-full h-full min-h-[200px] relative overflow-hidden group"
            >
                {/* Decorative background element: A faint diagonal sash */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                {/* Header Section: Title and Status */}
                <div className="flex justify-between items-start gap-3">
                    {/* Title area */}
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {course.title}
                        </h3>
                        <span className="text-xs text-text-muted mt-1 block font-mono">
                            ID: {course._id.slice(-6)}
                        </span>
                    </div>

                    {/* Status Badge: Always 'Active' or 'Completed' */}
                    <StatusBadge status={course.progress === 100 ? 'Completed' : 'Active'} />
                </div>

                {/* Stats Row: Uses Flexbox for alignment */}
                <div className="flex items-center gap-4 text-sm text-text-muted mt-auto pt-4 border-t border-white/5">

                    {/* Module Count */}
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-primary/70" />
                        <span>{course.videoCount || course.videos?.length || 0} Videos</span>
                    </div>

                    {/* Immutable Lock Icon: Visual reminder that edits are locked */}
                    <div className="flex items-center gap-1.5 ml-auto text-xs text-white/40" title="Immutable Protocol">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                    </div>
                </div>

                {/* Progress Bar (Visual only for now) */}
                <div className="w-full h-1 bg-surface rounded-full overflow-hidden mt-2">
                    <div
                        className="h-full bg-primary shadow-[0_0_10px_rgba(0,224,142,0.5)]"
                        style={{ width: `${course.progress || 0}%` }}
                    />
                </div>

            </motion.div>
        </Link>
    );
};

export default CourseCard;
