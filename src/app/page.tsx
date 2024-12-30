"use client"
import { VideoPlayer } from '@/components/VideoPlayer';
import { videos } from '@/constants';
import React, { useState } from 'react';


export default function App() {
  const [currentVideo, setCurrentVideo] = useState(videos[0]);

  const handleNext = () => {
    const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
    const nextIndex = (currentIndex + 1) % videos.length;
    setCurrentVideo(videos[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
    const previousIndex = (currentIndex - 1 + videos.length) % videos.length;
    setCurrentVideo(videos[previousIndex]);
  };

  const hendleSelectVideo = (id: string) => {
    const video = videos.find(v => v.id === id);
    if(video){
      setCurrentVideo(video);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Video Streaming App</h1>
      <VideoPlayer video={currentVideo} onNext={handleNext} onPrevious={handlePrevious} onSelect={hendleSelectVideo} />
    </div>
  );
}

