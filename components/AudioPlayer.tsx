import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Activity } from 'lucide-react';
import { ContentData } from '../types';

interface AudioPlayerProps {
  uiLabels: ContentData['ui'];
  shouldPlay: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ uiLabels, shouldPlay }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Watch for the 'shouldPlay' signal from the parent (Modal click)
  useEffect(() => {
    if (shouldPlay && audioRef.current && !isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            // Smooth fade in
            audioRef.current!.volume = 0;
            const fadeIn = setInterval(() => {
              if (audioRef.current && audioRef.current.volume < 0.5) {
                audioRef.current.volume = Math.min(0.5, audioRef.current.volume + 0.05);
              } else {
                clearInterval(fadeIn);
              }
            }, 100);
          })
          .catch(error => {
            console.error("Playback prevented:", error);
          });
      }
    }
  }, [shouldPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <audio 
        ref={audioRef} 
        src="https://beyincikisleri.co/bg.mp3" 
        loop 
        preload="auto"
      />
      
      <div className="max-w-screen-xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Visualizer / Status */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-400">
           <Activity className={`w-4 h-4 ${isPlaying ? 'text-brand-accent animate-pulse' : 'text-gray-600'}`} />
           <span className="tracking-widest opacity-60">AUDIO EXPERIENCE</span>
        </div>

        {/* Controls Container */}
        <div className="flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl mx-auto md:mx-0">
          
          <button 
            onClick={togglePlay}
            className="group flex items-center gap-3 hover:text-brand-accent transition-colors duration-300"
            aria-label={isPlaying ? uiLabels.pause : uiLabels.play}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white group-hover:text-brand-accent" />
            ) : (
              <Play className="w-5 h-5 text-white group-hover:text-brand-accent ml-1" />
            )}
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              {isPlaying ? uiLabels.pause : uiLabels.play}
            </span>
          </button>

          <div className="h-4 w-[1px] bg-white/20 mx-2"></div>

          <button 
            onClick={toggleMute}
            className="hover:text-brand-accent transition-colors duration-300"
            aria-label={isMuted ? uiLabels.unmute : uiLabels.mute}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;