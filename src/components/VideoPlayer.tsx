import React, { useState, useEffect } from 'react';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { Video } from '../types/video';

interface VideoPlayerProps {
    video: Video;
    onNext: () => void;
    onPrevious: () => void;
    onSelect: (id: string) => void;
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function VideoPlayer({ video, onNext, onPrevious, onSelect }: VideoPlayerProps) {
  const { 
    videoRef, 
    isPlaying, 
    progress, 
    currentTime, 
    duration, 
    playbackSpeed, 
    togglePlay, 
    changePlaybackSpeed, 
    resetPlayer,
    playVideo
  } = useVideoPlayer();
  const [showThumbnail, setShowThumbnail] = useState(true);

  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changePlaybackSpeed(Number(event.target.value));
  };

  const handleVideoClick = () => {
    if (showThumbnail) {
      setShowThumbnail(false);
    }
    togglePlay();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNext();
    resetPlayer();
    setShowThumbnail(true);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPrevious();
    resetPlayer();
    setShowThumbnail(true);
  };

  useEffect(() => {
    resetPlayer();
    setShowThumbnail(true);
  }, [video, resetPlayer]);

  useEffect(() => {
    if (!showThumbnail) {
      playVideo();
    }
  }, [showThumbnail, playVideo]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative aspect-video">
        {showThumbnail && (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            onClick={() => setShowThumbnail(false)}
          />
        )}
        <video
          ref={videoRef}
          src={video.src}
          className={`absolute inset-0 w-full h-full ${showThumbnail ? 'invisible' : 'visible'}`}
          onClick={handleVideoClick}
          onPlay={() => setShowThumbnail(false)}
          onEnded={() => setShowThumbnail(true)}
          preload="metadata"
          playsInline
        />
        <div className="absolute inset-0 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity duration-300" onClick={togglePlay}>
          <button
            onClick={handlePrevious}
            className="ml-4 px-3 py-1 bg-white bg-opacity-75 text-black text-sm rounded hover:bg-opacity-100 transition-all duration-300"
          >
            Previous
          </button>
          <div className='flex flex-col justify-end h-full gap-5 mb-5'>
            { video?.options && video.options.map((option) => (
                <button 
                key={option.id}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onSelect(option.id); 
                }}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                {option?.title}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            className="mr-4 px-3 py-1 bg-white bg-opacity-75 text-black text-sm rounded hover:bg-opacity-100 transition-all duration-300"
          >
            Next
          </button>
        </div>
      </div>
      <div className="mt-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">{video.title}</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <select
              value={playbackSpeed}
              onChange={handleSpeedChange}
              className="bg-white border border-gray-300 text-gray-700 py-1 px-2 text-sm rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
            <button 
              onClick={togglePlay} 
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>
        <div className="bg-gray-200 h-2 rounded">
          <div
            className="bg-blue-500 h-full rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

