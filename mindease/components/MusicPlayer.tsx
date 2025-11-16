import React, { useState, useRef, useEffect } from 'react';
import { MUSIC_TRACKS } from '../constants';
import { Page } from '../types';
import MusicIcon from './icons/MusicIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface MusicPlayerProps {
    onNavigate: (page: Page) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onNavigate }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = MUSIC_TRACKS[currentTrackIndex];

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
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % MUSIC_TRACKS.length);
    setIsPlaying(true);
  };

  const playPrevTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
    setIsPlaying(true);
  };
  
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mb-4 transition-colors">
            <ArrowLeftIcon />
            Back to Dashboard
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <audio
                ref={audioRef}
                src={currentTrack.src}
                onEnded={playNextTrack}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Main Player */}
            <div className="md:col-span-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center border border-slate-200 dark:border-gray-700">
                <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-full p-6 mb-6">
                    <MusicIcon size="large" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{currentTrack.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">{currentTrack.artist}</p>

                <div className="flex items-center space-x-6">
                    <button onClick={playPrevTrack} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14.006V5.994a1 1 0 00-1.555-.832L4.212 9.168a1 1 0 000 1.664l4.233 4.000zM11.555 5.162A1 1 0 0010 5.994v8.012a1 1 0 001.555.832l4.233-4.006a1 1 0 000-1.664l-4.233-4.006z"/></svg>
                    </button>
                    <button 
                        onClick={togglePlayPause} 
                        className="bg-blue-600 dark:bg-blue-500 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:scale-105 transform transition"
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.006v3.988a1 1 0 001.555.832l3.197-2.005a1 1 0 000-1.664L9.555 7.168z" clipRule="evenodd" /></svg>
                        )}
                    </button>
                    <button onClick={playNextTrack} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 5.994v8.012a1 1 0 001.555.832l4.233-4.006a1 1 0 000-1.664L4.555 5.168zM11.555 5.168A1 1 0 0010 5.994v8.012a1 1 0 001.555.832l4.233-4.006a1 1 0 000-1.664l-4.233-4.006z"/></svg>
                    </button>
                </div>
            </div>

            {/* Playlist */}
            <div className="md:col-span-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">Playlist</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                {MUSIC_TRACKS.map((track, index) => (
                    <div
                    key={track.id}
                    onClick={() => selectTrack(index)}
                    className={`p-3 rounded-lg cursor-pointer transition flex items-center space-x-3 ${
                        currentTrackIndex === index ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    >
                    <div className="text-blue-500 dark:text-blue-400">
                        {currentTrackIndex === index && isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M18 3v14a2 2 0 01-2 2H4a2 2 0 01-2-2V3a2 2 0 012-2h12a2 2 0 012 2zM9.5 14.5a.5.5 0 00.5-.5v-9a.5.5 0 00-1 0v9a.5.5 0 00.5.5zm4 0a.5.5 0 00.5-.5v-9a.5.5 0 00-1 0v9a.5.5 0 00.5.5z"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.006v3.988a1 1 0 001.555.832l3.197-2.005a1 1 0 000-1.664L9.555 7.168z" clipRule="evenodd" /></svg>
                        )}
                    </div>
                    <div>
                        <p className={`font-semibold text-sm ${currentTrackIndex === index ? 'text-blue-800 dark:text-blue-200' : 'text-gray-800 dark:text-gray-200'}`}>
                            {track.title}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{track.artist}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default MusicPlayer;