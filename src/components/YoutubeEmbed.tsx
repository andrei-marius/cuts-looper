'use client';

import { useEffect, useRef, useState } from 'react';
import { Cut } from '@/app/lib/types';
import { useStore } from '@/app/lib/store';
import Cuts from './Cuts';
import PlayManager from './PlayManager';
import ShareAndSave from './ShareAndSave';
import { extractVideoId } from '@/app/lib/utils';

export default function YouTubeEmbed() {
  const playerRef = useRef<any>(null);
  const currentCut = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string>('')
  const [url, setUrl] = useState<string>('')

  const {
    cuts,
    setCuts,
    setShareUrl,
  } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v');
    const cutsParam = params.get('cuts');
    if (v && cutsParam) {
      try {
        const parsed: Cut[] = JSON.parse(decodeURIComponent(cutsParam));
        if (parsed.length) {
          embedYtVideo(v);
          setCuts(parsed);
          // setAutoplay(true);
        }
      } catch {
        console.error('Invalid cuts param');
      }
    }
  }, []);

  function embedYtVideo(videoId: string) {
    if (!window['YT']) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    if (playerRef.current && playerRef.current.destroy) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
  
    const createPlayer = () => {
      playerRef.current = new (window as any).YT.Player('ytplayer', {
        videoId,
        events: {
          onReady: undefined, //autoplay ? () => startCutLoop() : undefined,
          onStateChange: onPlayerStateChange,
        },
      });
    };
  
    if ((window as any).YT && (window as any).YT.Player) {
      createPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    }
  
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }
  
  const handleUrlPasteChange = (e: React.ChangeEvent<HTMLInputElement>) => {    
    const id = extractVideoId(e.target.value);
    if (id) {
      setUrl(e.target.value)
      setVideoId(id);
      embedYtVideo(id);
      setCuts([]);
      setShareUrl('');
    }
  };

  // const onPlayerReady = () => {
  //   // Do NOT auto-play on ready anymore
  //   playerRef.current.pauseVideo();
  //   setIsPlaying(false);
  //   setIsFinished(false);
  //   currentCut.current = 0;
  // };

  const onPlayerStateChange = (event: any) => {
    // If user manually pauses video during cuts, stop the loop
    if (event.data === (window as any).YT.PlayerState.PAUSED) {
      const currentTime = playerRef.current?.getCurrentTime?.() ?? 0;
      const cut = cuts[currentCut.current];
    
      if (
        isPlaying &&
        cut &&
        currentTime > cut.start + 0.3 // tolerate slight float inaccuracy
      ) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPlaying(false);
      }
    }
    
  };

  return (
    <>
      <h1 className="text-xl mb-4 font-bold">Paste or type YouTube URL or Video ID or Share URL</h1>

      <input
        type="text"
        onChange={handleUrlPasteChange}
        className="w-full p-2 border rounded mb-4"
        placeholder="Youtube URL/Video ID/Share URL"
        value={url}
      />
  
      {videoId && (
        <div className="flex flex-col items-center gap-4">
          <div className="aspect-[16/9] w-full max-w-3xl">
            <div id="ytplayer" className="w-full h-full rounded-md" />
          </div>

          <PlayManager 
            playerRef={playerRef} 
            currentCut={currentCut} 
            intervalRef={intervalRef}
            setIsPlaying={setIsPlaying}
          />

          <div className="mb-4">
            
            <Cuts />

            <ShareAndSave 
              videoId={videoId} 
              setVideoId={setVideoId} 
              setUrl={setUrl} 
            />

          </div>
        </div>
      )}
    </>
  ); 
}
