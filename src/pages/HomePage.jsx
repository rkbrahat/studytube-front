import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Layers, Shield, X, Maximize2 } from 'lucide-react';
import NeonButton from '../components/atoms/NeonButton';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes';

/**
 * HomePage Component
 */
const HomePage = () => {
    const { user } = useAuth();
    const [showDemo, setShowDemo] = useState(false);
    const destination = user ? ROUTES.CREATE_COURSE : ROUTES.SIGNUP;

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">

            {/* --- Background Ambient Glow Effects --- */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            {/* --- Hero Section --- */}
            <main className="container mx-auto px-4 md:px-8 py-24 relative z-10 flex flex-col items-center text-center mt-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6 max-w-4xl"
                >
                    <div className="inline-block border border-primary/30 bg-primary/5 rounded-full px-4 py-1.5 backdrop-blur-sm">
                        <span className="text-primary text-xs font-mono tracking-widest uppercase">System Online: v1.0.0</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-text-main leading-tight">
                        Focus Mode: <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Engaged.</span>
                    </h1>

                    <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                        Create custom courses from YouTube. Zero ads. Zero suggestions. Pure learning efficiency in a high-tech environment.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-8">
                        <Link to={destination}>
                            <NeonButton variant="primary" className="h-12 px-8 text-lg">
                                <Play className="w-5 h-5 fill-current" /> {user ? 'Create Protocol' : 'Start Learning'}
                            </NeonButton>
                        </Link>
                    </div>
                </motion.div>

                {/* --- Features Grid --- */}
                <div className="flex flex-col md:flex-row gap-6 mt-24 md:mt-32 w-full max-w-6xl">
                    {[
                        {
                            icon: <Shield className="w-8 h-8 text-primary" />,
                            title: "Distraction Free",
                            desc: "No sidebar suggestions or autoplaying rabbit holes. Just the content you chose."
                        },
                        {
                            icon: <Layers className="w-8 h-8 text-primary" />,
                            title: "Structure Your Way",
                            desc: "Group videos into custom modules and tracks that make sense for your goals."
                        },
                        {
                            icon: <Play className="w-8 h-8 text-primary" />,
                            title: "Progress Tracking",
                            desc: "Real percentage tracking for every video and course you create."
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            viewport={{ once: true }}
                            className="glass flex flex-col items-center justify-center p-8 rounded-xl border border-white/5 hover:border-primary/30 transition-colors group"
                        >
                            <div className="mb-4 bg-white/5 w-fit p-3 rounded-lg group-hover:bg-primary/10 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-2">{feature.title}</h3>
                            <p className="text-text-muted">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HomePage;
