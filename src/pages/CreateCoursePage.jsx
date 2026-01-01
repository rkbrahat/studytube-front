import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertCircle, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../components/atoms/NeonButton';
import TechInput from '../components/atoms/TechInput';
import api from '../services/api';

/**
 * CreateCoursePage Component
 * 
 * Connected to Backend via API.
 */
const CreateCoursePage = () => {
    const navigate = useNavigate();
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [videoList, setVideoList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Extract URL or ID from input
    // Supports:
    // 1. Full <iframe src="..."> code
    // 2. Direct URLs (embed, watch, short)
    const extractVideoSrc = (input) => {
        // Check if input is iframe code
        if (input.includes('<iframe')) {
            const srcMatch = input.match(/src="([^"]+)"/);
            return srcMatch ? srcMatch[1] : input;
        }
        // Handle youtube-nocookie.com by replacing it with youtube.com for consistency
        // The getYoutubeId function already handles the 'embed/' path for both.
        let cleanedInput = input.trim();
        if (cleanedInput.includes('youtube-nocookie.com')) {
            cleanedInput = cleanedInput.replace('youtube-nocookie.com', 'youtube.com');
        }
        return cleanedInput;
    };

    const getYoutubeId = (url) => {
        try {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        } catch (e) { return null; }
    };

    const getPlaylistId = (url) => {
        try {
            const regExp = /[?&]list=([^#\&\?]+)/;
            const match = url.match(regExp);
            return match ? match[1] : null;
        } catch (e) { return null; }
    };

    const handleAddVideo = () => {
        if (!videoLink) return;
        const cleanUrl = extractVideoSrc(videoLink);

        const playlistId = getPlaylistId(cleanUrl);
        const videoId = getYoutubeId(cleanUrl);

        let newModule = null;

        if (playlistId) {
            // User requested single video behavior for playlist
            newModule = {
                url: cleanUrl,
                title: `Playlist ${videoList.length + 1}`,
                youtubeId: playlistId,
                type: 'playlist'
            };
        } else if (videoId) {
            newModule = {
                url: `https://www.youtube.com/watch?v=${videoId}`,
                title: `Video ${videoList.length + 1}`,
                youtubeId: videoId,
                type: 'video'
            };
        } else {
            alert("Invalid YouTube URL. Please use a valid video or playlist link.");
            return;
        }

        setVideoList([...videoList, newModule]);
        setVideoLink('');
    };

    const handleSave = async () => {
        if (!newCourseTitle || videoList.length === 0) return;
        setIsLoading(true);
        try {
            await api.post('/courses', {
                title: newCourseTitle,
                videos: videoList
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to create course", error);
            const message = error.response?.data?.message || error.message || 'Failed to Initialize Protocol';
            alert(`Error: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-main p-8 pt-24 font-sans relative">
            <div className="fixed top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto relative z-10 mb-20">

                <div className="flex items-center gap-4 mb-8">
                    <NeonButton variant="secondary" onClick={() => navigate('/dashboard')} className="px-3">
                        <ArrowLeft className="w-4 h-4" />
                    </NeonButton>
                    <h1 className="text-2xl font-bold text-text-main">Initialize Protocol</h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-8 border border-primary/20"
                >
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <Plus className="w-5 h-5" />
                        <h2 className="font-bold font-mono uppercase">New Configuration</h2>
                    </div>

                    <div className="bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 p-4 rounded-lg mb-6 flex gap-3 text-sm text-yellow-800 dark:text-yellow-200">
                        <AlertCircle className="w-5 h-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                        <p>Warning: Protocols are immutable. Once initialized, videos cannot be edited or removed. But you can delete the entire protocol.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <TechInput
                            label="Protocol Name"
                            placeholder="e.g. Advanced React Patterns"
                            value={newCourseTitle}
                            onChange={(e) => setNewCourseTitle(e.target.value)}
                        />

                        <div className="space-y-2">
                            <TechInput
                                label="Add Video URL(playlist won't work)"
                                placeholder="https://youtube.com/watch?v=..."
                                value={videoLink}
                                onChange={(e) => setVideoLink(e.target.value)}
                            />
                            <NeonButton
                                variant="secondary"
                                className="w-full py-2 text-xs"
                                onClick={handleAddVideo}
                            >
                                Add to Queue
                            </NeonButton>
                        </div>

                        {videoList.length > 0 && (
                            <div className="bg-surface/50 rounded-md p-4 border border-text-main/10">
                                <span className="text-xs text-text-muted font-mono block mb-3 uppercase tracking-wider">
                                    Queue Sequence ({videoList.length})
                                </span>
                                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
                                    {videoList.map((vid, idx) => (
                                        <div key={idx} className="text-xs text-text-main truncate font-mono px-3 py-2 bg-text-main/5 rounded border border-text-main/5 flex justify-between items-center group hover:border-primary/30 transition-colors">
                                            <span className="truncate flex-1">{vid.url}</span>
                                            <span className="text-primary/50 text-[10px] ml-2">#{idx + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="h-px bg-text-main/10 my-2" />

                        <div className="flex flex-col md:flex-row gap-4">
                            <NeonButton
                                variant="primary"
                                className="flex-1 px-4 py-2 text-sm"
                                onClick={handleSave}
                                isLoading={isLoading}
                            >
                                <Save className="w-3 md:w-5 h-3 md:h-5" /> Initialize Protocol
                            </NeonButton>
                            <NeonButton
                                variant="secondary"
                                className="flex-1 px-4 py-2 text-sm"
                                onClick={() => navigate('/dashboard')}
                                disabled={isLoading}
                            >
                                Cancel
                            </NeonButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateCoursePage;
