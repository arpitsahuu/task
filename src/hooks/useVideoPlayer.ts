import { useState, useRef, useCallback, useEffect } from 'react';

export function useVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => console.error("Error playing video:", error));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleDurationChange = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const changePlaybackSpeed = useCallback((speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  }, []);

  const resetPlayer = useCallback(() => {
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, []);

  const playVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error("Error playing video:", error));
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('durationchange', handleDurationChange);
      videoElement.addEventListener('play', () => setIsPlaying(true));
      videoElement.addEventListener('pause', () => setIsPlaying(false));
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('durationchange', handleDurationChange);
        videoElement.removeEventListener('play', () => setIsPlaying(true));
        videoElement.removeEventListener('pause', () => setIsPlaying(false));
      };
    }
  }, [handleTimeUpdate, handleDurationChange]);

  return { 
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
  };
}

