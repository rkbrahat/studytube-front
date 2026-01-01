import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, CheckCircle, ArrowLeft, Menu, Circle, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import YouTube from 'react-youtube';
import screenfull from 'screenfull';
import NeonButton from '../components/atoms/NeonButton';
import api from '../services/api';

/**
 * CustomPlayerControls Component
 */
const Controls = ({
    playing,
    onPlayPause,
    onSeek,
    onSeekMouseUp,
    onSeekMouseDown,
    played,
    duration,
    volume,
    onVolumeChange,
    onToggleMute,
    muted,
    isFullscreen,
    onToggleFullscreen,
    visible // New Prop
}) => {
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "00:00";
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, "0");
        if (hh) return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
        return `${mm}:${ss}`;
    };

    return (
        <div
            className={`absolute inset-0 flex flex-col justify-end transition-all duration-300 pointer-events-auto bg-transparent ${visible ? 'opacity-100 cursor-auto' : 'opacity-0 cursor-none'}`}
            onClick={(e) => {
                // Prevent click only if clicking controls
                if (e.target.closest('input') || e.target.closest('button')) return;
                onPlayPause();
            }}
        >
            {/* Dark gradient for controls visibility */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${visible ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`relative z-20 px-4 pb-4 transition-opacity duration-300 pointer-events-auto ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-xs font-mono text-primary/80">{formatTime(duration * played)}</span>
                    <input
                        type="range"
                        min={0}
                        max={0.999999}
                        step="any"
                        value={played}
                        onMouseDown={onSeekMouseDown}
                        onChange={onSeek}
                        onMouseUp={onSeekMouseUp}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                    <span className="text-xs font-mono text-white/50">{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onPlayPause}
                            className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors border border-primary/20 hover:scale-105"
                        >
                            {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>

                        <div className="flex items-center gap-2 group/vol">
                            <button onClick={onToggleMute} className="text-white/70 hover:text-white">
                                {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step="any"
                                    value={muted ? 0 : volume}
                                    onChange={onVolumeChange}
                                    className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onToggleFullscreen}
                        className="p-2 text-white/70 hover:text-white hover:scale-110 transition-all"
                        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            {/* Center Play Button for Pause State - Only visible if Controls are visible OR if Paused? 
                Actually, usually center play button appears when paused. 
                User said "make it visible when... pause". 
                I will tie it to 'visible' as well to be consistent with "hide all controls".
            */}
            {!playing && visible && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30 animate-pulse transition-transform">
                        <Play className="w-10 h-10 text-primary fill-current ml-1" />
                    </div>
                </div>
            )}
        </div>
    );
};


const CoursePlayerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Player Ref for YT Instance
    const playerRef = useRef(null);
    const intervalRef = useRef(null);
    const playerContainerRef = useRef(null);

    // State
    const [course, setCourse] = useState(null);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Player State
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(100);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef(null);

    const handleActivity = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${id}`);
                setCourse(data);
            } catch (error) {
                console.error("Error loading course:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    // Clear interval and fs listener + Add Keyboard Listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(screenfull.isFullscreen);
        };

        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handleActivity(); // Show controls on key press
                handlePlayPause();
            }
        };

        if (screenfull.isEnabled) {
            screenfull.on('change', handleFullscreenChange);
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            if (screenfull.isEnabled) {
                screenfull.off('change', handleFullscreenChange);
            }
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [playing]); // Re-bind when playing state changes to ensure toggle works correctly

    const handleToggleComplete = async (videoId, currentStatus) => {
        try {
            const updatedVideos = course.videos.map(v =>
                v._id === videoId ? { ...v, isCompleted: !currentStatus } : v
            );
            setCourse({ ...course, videos: updatedVideos });
            await api.put(`/courses/${id}/videos/${videoId}`, { isCompleted: !currentStatus });
        } catch (error) { console.error(error); }
    };

    // --- ID Extraction Helper ---
    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Player Handlers for React-YouTube
    const onReady = (event) => {
        playerRef.current = event.target;
        setDuration(playerRef.current.getDuration());
        setVolume(playerRef.current.getVolume());
        setMuted(playerRef.current.isMuted());
    };

    const onStateChange = (event) => {
        // PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
        const playerState = event.data;
        setPlaying(playerState === 1);

        if (playerState === 1) { // Playing
            startProgressLoop();
        } else {
            stopProgressLoop();
        }

        if (playerState === 0) { // Ended
            handleToggleComplete(course.videos[activeVideoIndex]._id, false);
        }
    };

    const startProgressLoop = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            if (playerRef.current && !seeking) {
                const currentTime = playerRef.current.getCurrentTime();
                const totalDuration = playerRef.current.getDuration();
                if (totalDuration > 0) {
                    setPlayed(currentTime / totalDuration);
                }
            }
        }, 1000);
    };

    const stopProgressLoop = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handlePlayPause = () => {
        if (!playerRef.current) return;
        handleActivity();
        if (playing) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const handleSeekChange = (e) => {
        setPlayed(parseFloat(e.target.value));
    };

    const handleSeekMouseDown = () => {
        setSeeking(true);
    };

    const handleSeekMouseUp = (e) => {
        setSeeking(false);
        if (playerRef.current) {
            const seekToTime = parseFloat(e.target.value) * duration;
            playerRef.current.seekTo(seekToTime);
        }
    };

    const handleVolumeChange = (e) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (playerRef.current) {
            playerRef.current.setVolume(newVol);
            if (newVol > 0 && muted) {
                playerRef.current.unMute();
                setMuted(false);
            }
        }
    };

    const handleToggleMute = () => {
        if (!playerRef.current) return;
        if (muted) {
            playerRef.current.unMute();
            setMuted(false);
        } else {
            playerRef.current.mute();
            setMuted(true);
        }
    };

    const handleToggleFullscreen = () => {
        if (screenfull.isEnabled && playerContainerRef.current) {
            screenfull.toggle(playerContainerRef.current);
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-mono animate-pulse">Loading Protocol...</div>;
    if (!course) return <div className="min-h-screen bg-background flex items-center justify-center text-red-500 font-mono">Protocol Not Found</div>;

    const currentVideo = course.videos[activeVideoIndex];
    const progressPercentage = Math.round((course.videos.filter(v => v.isCompleted).length / course.videos.length) * 100);
    const videoId = currentVideo.youtubeId || getYoutubeId(currentVideo.url);
    // Robust check: Trust DB type OR detect standard Playlist ID prefix (PL, RD, etc)
    const isPlaylist = currentVideo.type === 'playlist' || (videoId && videoId.startsWith('PL'));

    // YouTube Options
    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            controls: 0, // Hide native controls
            modestbranding: 1,
            rel: 0,
            disablekb: 1,
            origin: window.location.origin,
            fs: 0 // Disable Native FS button in youtube
        },
    };

    if (isPlaylist) {
        opts.playerVars.listType = 'playlist';
        opts.playerVars.list = videoId;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-hidden">
            <header className="h-16 border-b border-white/5 bg-surface/50 backdrop-blur-md flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="text-text-muted hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-sm md:text-lg font-bold text-white truncate max-w-[200px] md:max-w-md">{course.title}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 hidden md:flex">
                        <span className="text-xs font-mono text-primary">PROGRESS: {progressPercentage}%</span>
                        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${progressPercentage}%` }} />
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-md lg:hidden">
                        <Menu className="w-5 h-5 text-white" />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                <main className="flex-1 overflow-y-auto relative bg-black flex flex-col">
                    <div
                        ref={playerContainerRef}
                        className={`relative w-full pb-[56.25%] bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 group select-none ${!showControls ? 'cursor-none' : ''}`}
                        style={isFullscreen ? { paddingBottom: 0, height: '100vh' } : {}}
                        onMouseMove={handleActivity}
                        onClick={handleActivity}
                    >
                        <div className="absolute inset-0">
                            {videoId ? (
                                <YouTube
                                    // If playlist, we don't pass a specific videoId to start (unless we wanted to).
                                    // Passing the Playlist ID as videoId causes error. Passing undefined lets 'list' opt take over.
                                    videoId={isPlaylist ? undefined : videoId}
                                    opts={opts}
                                    onReady={onReady}
                                    onStateChange={onStateChange}
                                    className="w-full h-full absolute inset-0"
                                    iframeClassName="w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/50">Invalid Video ID</div>
                            )}
                        </div>

                        <Controls
                            playing={playing}
                            onPlayPause={handlePlayPause}
                            onSeek={handleSeekChange}
                            onSeekMouseDown={handleSeekMouseDown}
                            onSeekMouseUp={handleSeekMouseUp}
                            played={played}
                            duration={duration}
                            volume={volume}
                            muted={muted}
                            onVolumeChange={handleVolumeChange}
                            onToggleMute={handleToggleMute}
                            isFullscreen={isFullscreen}
                            onToggleFullscreen={handleToggleFullscreen}
                            visible={showControls}
                        />
                    </div>

                    {/* INFO SECTION */}
                    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                    {currentVideo.title || `Module ${activeVideoIndex + 1}`}
                                    {currentVideo.isCompleted && <CheckCircle className="w-5 h-5 text-primary" />}
                                </h2>
                            </div>
                            <div className="flex gap-3">
                                <NeonButton
                                    variant={currentVideo.isCompleted ? "primary" : "secondary"}
                                    onClick={() => handleToggleComplete(currentVideo._id, currentVideo.isCompleted)}
                                    className="px-4"
                                >
                                    {currentVideo.isCompleted ? "Completed" : "Mark Complete"}
                                </NeonButton>
                                <div className="w-px bg-white/10 mx-2" />
                                <NeonButton
                                    variant="secondary"
                                    onClick={() => activeVideoIndex > 0 && setActiveVideoIndex(prev => prev - 1)}
                                    disabled={activeVideoIndex === 0}
                                    className="px-3"
                                >
                                    Prev
                                </NeonButton>
                                <NeonButton
                                    variant="secondary"
                                    onClick={() => activeVideoIndex < course.videos.length - 1 && setActiveVideoIndex(prev => prev + 1)}
                                    disabled={activeVideoIndex === course.videos.length - 1}
                                    className="px-3"
                                >
                                    Next
                                </NeonButton>
                            </div>
                        </div>
                    </div>

                </main>
                <aside className={`
                    w-80 bg-surface/90 border-l border-white/5 flex flex-col absolute right-0 top-0 bottom-0 z-20 backdrop-blur-xl transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                    lg:relative lg:translate-x-0
                `}>
                    <div className="p-4 border-b border-white/5 bg-surface">
                        <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider mb-1">Course Content</h3>
                        <p className="text-xs text-white/50">{course.videos.length} Modules</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {course.videos.map((vid, idx) => {
                            const isActive = idx === activeVideoIndex;
                            return (
                                <button
                                    key={vid._id}
                                    onClick={() => setActiveVideoIndex(idx)}
                                    className={`
                                        w-full flex items-start gap-3 p-3 rounded-md text-left transition-all group
                                        ${isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5 border border-transparent'}
                                    `}
                                >
                                    <div className={`mt-0.5 ${vid.isCompleted ? 'text-primary' : 'text-white/20'}`}>
                                        {vid.isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-text-muted group-hover:text-white'}`}>
                                            {vid.title || `Module ${idx + 1}`}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CoursePlayerPage;
