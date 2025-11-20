import React, { useState, useRef, useEffect } from 'react';
import { Page, Mood } from '../types';
import { Music, ArrowLeft, SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface MusicPlayerProps {
    onNavigate: (page: Page) => void;
}

const MOODS: Mood[] = ['happy', 'chill', 'sad', 'anxious', 'irritable', 'calm'];

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onNavigate }) => {
    const [selectedMood, setSelectedMood] = useState<Mood>('calm');
    const [musicFiles, setMusicFiles] = useState<string[]>([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const MOODS: Mood[] = ['happy', 'chill', 'sad', 'anxious', 'irritable', 'calm'];
    useEffect(() => {
        const fetchMusic = async () => {
            setLoading(true);
            try {
                const res = await apiClient.getMusicByMood(selectedMood);
                console.log('Music fetched:', res);
                setMusicFiles(res.files);
                setCurrentTrackIndex(0);
            } catch (err) {
                console.error('Error fetching music:', err);
                setMusicFiles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMusic();
    }, [selectedMood]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(error => console.error("Audio play failed:", error));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackIndex]);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const playNextTrack = () => {
        if (musicFiles.length > 0) {
            setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicFiles.length);
            setIsPlaying(true);
        }
    };

    const playPrevTrack = () => {
        if (musicFiles.length > 0) {
            setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + musicFiles.length) % musicFiles.length);
            setIsPlaying(true);
        }
    };

    const selectTrack = (index: number) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mb-4 transition-colors">
                <ArrowLeft size={20} />
                Back to Dashboard
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <audio
                    ref={audioRef}
                    src={musicFiles.length > 0 ? `http://localhost:5000/api/music/${selectedMood}/${musicFiles[currentTrackIndex]}` : undefined}
                    onEnded={playNextTrack}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />

                {/* Main Player */}
                <div className="md:col-span-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center border border-slate-200 dark:border-gray-700">
                    <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-full p-6 mb-6">
                        <Music size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{musicFiles.length > 0 ? musicFiles[currentTrackIndex] : 'No tracks available'}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">{selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Playlist</p>

                    <div className="flex items-center space-x-6">
                        <button onClick={playPrevTrack} disabled={musicFiles.length === 0} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14.006V5.994a1 1 0 00-1.555-.832L4.212 9.168a1 1 0 000 1.664l4.233 4.000zM11.555 5.162A1 1 0 0010 5.994v8.012a1 1 0 001.555.832l4.233-4.006a1 1 0 000-1.664l-4.233-4.006z"/></svg>
                        </button>
                        <button 
                            onClick={togglePlayPause}
                            disabled={musicFiles.length === 0}
                            className="bg-blue-600 dark:bg-blue-500 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.006v3.988a1 1 0 001.555.832l3.197-2.005a1 1 0 000-1.664L9.555 7.168z" clipRule="evenodd" /></svg>
                            )}
                        </button>
                        <button onClick={playNextTrack} disabled={musicFiles.length === 0} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 14.838A1 1 0 0110 14.006V5.994a1 1 0 011.555-.832l4.233 4.006a1 1 0 010 1.664l-4.233 4.006zM8.445 5.168A1 1 0 0110 5.994v8.012a1 1 0 01-1.555.832L4.212 10.832a1 1 0 010-1.664l4.233-4.000z"/></svg>
                        </button>
                    </div>

                    
                </div>
                {/* Playlist (right) */}
                <div className="md:col-span-1 bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-inner border border-slate-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Playlist</h3>

                    {/* Mood selector as buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {MOODS.map(mood => (
                            <button
                                key={mood}
                                onClick={() => setSelectedMood(mood)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition ${selectedMood === mood ? 'bg-blue-600 text-white dark:bg-blue-500' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
                            >
                                {mood.charAt(0).toUpperCase() + mood.slice(1)}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-gray-500 dark:text-gray-400">Loading tracks...</div>
                    ) : (
                        <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                            {musicFiles.length === 0 ? (
                                <li className="text-gray-500 dark:text-gray-400">No tracks available</li>
                            ) : (
                                musicFiles.map((file, idx) => (
                                    <li key={file} onClick={() => selectTrack(idx)} className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition ${idx === currentTrackIndex ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-slate-100 dark:hover:bg-gray-700'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded flex items-center justify-center text-sm">♫</div>
                                            <div>
                                                <div className="font-medium text-gray-800 dark:text-white">{file}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">{idx === currentTrackIndex && isPlaying ? 'Playing' : 'Play'}</div>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
  );
};

export default MusicPlayer;