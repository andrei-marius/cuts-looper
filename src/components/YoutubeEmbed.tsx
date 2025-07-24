'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { timestampToSeconds, secondsToTimestamp } from '@/lib/utils';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Cut } from '@/lib/types';
import { useStore } from '@/lib/store';
import { SaveLoopButton } from './SaveLoop';
import { Button } from './ui/button';
import { buildShareUrl } from '@/lib/utils';

export default function YouTubeEmbed() {
  const [url, setUrl] = useState('');
  // const [videoId, setVideoId] = useState<string | null>(null);
  // const [cuts, setCuts] = useState<Cut[]>([]);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  // const [autoplay, setAutoplay] = useState(false);
  // const [shareUrl, setShareUrl] = useState('');
  const playerRef = useRef<any>(null);
  const currentCut = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const loopRef = useRef(false);
  const [loop, _setLoop] = useState(false);

  const setLoop = (val: boolean) => {
    loopRef.current = val;
    _setLoop(val);
  };

  const {
    cuts,
    shareUrl,
    videoId,
    setCuts,
    addCut,
    removeCut,
    clearCuts,
    setShareUrl,
    setVideoId,
  } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v');
    const cutsParam = params.get('cuts');
    if (v && cutsParam) {
      try {
        const parsed: Cut[] = JSON.parse(decodeURIComponent(cutsParam));
        if (parsed.length) {
          setVideoId(v);
          setCuts(parsed);
          // setAutoplay(true);
        }
      } catch {
        console.error('Invalid cuts param');
      }
    }
  }, []);

  useEffect(() => {
    if (!window['YT']) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }, []);
  
  useEffect(() => {
    if (!videoId) return;
  
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
  }, [videoId]);
  
  // useEffect(() => {
  //   if (!videoId) return;

  //   const tag = document.createElement('script');
  //   tag.src = 'https://www.youtube.com/iframe_api';
  //   document.body.appendChild(tag);

  //   (window as any).onYouTubeIframeAPIReady = () => {
  //     playerRef.current = new (window as any).YT.Player('ytplayer', {
  //       videoId,
  //       events: {
  //         onReady: autoplay ? () => startCutLoop() : undefined,
  //         onStateChange: onPlayerStateChange,
  //       },
  //     });
  //   };

  //   return () => {
  //     if (intervalRef.current) clearInterval(intervalRef.current);
  //   };
  // }, [videoId]);

  const extractVideoId = (input: string): string | null => {
    const trimmed = input.trim();
  
    // If it's a raw video ID (11 characters, alphanumeric, common in YT)
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
  
    try {
      const url = new URL(trimmed);
      const hostname = url.hostname;
      const searchParams = url.searchParams;
  
      if (hostname.includes('youtube.com')) {
        return searchParams.get('v');
      } else if (hostname === 'youtu.be') {
        return url.pathname.slice(1);
      }
    } catch {
      // Ignore invalid URL, fallback already handled
    }
  
    return null;
  };
  
  
  const handleUrlPasteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const id = extractVideoId(text);
    if (id) {
      setUrl(text);
      setVideoId(id);
      setCuts([]);
      setShareUrl('');
    }
  };
  
  const addCutFunc = () => {
    const s = timestampToSeconds(newStart);
    const e = timestampToSeconds(newEnd);
    if (!isNaN(s) && !isNaN(e) && s < e) {
      addCut({ start: s, end: e });
      setNewStart('');
      setNewEnd('');
      setShareUrl('');
    } else {
      toast.error('Invalid timestamp format or start >= end');
    }
  };

  // const onPlayerReady = () => {
  //   // Do NOT auto-play on ready anymore
  //   playerRef.current.pauseVideo();
  //   setIsPlaying(false);
  //   setIsFinished(false);
  //   currentCut.current = 0;
  // };

  const startCutLoop = () => {
    if (cuts.length === 0) {
      toast.error('Add at least one Cut first');
      return;
    }
  
    if (!playerRef.current) {
      return;
    }
  
    clearInterval(intervalRef.current!);
    currentCut.current = 0;
    setIsFinished(false);
    setIsPlaying(true);
    playCurrentCut();
  };

  const playCurrentCut = () => {
    const current = cuts[currentCut.current];

    if (!current) {
      if (loopRef.current) {
        currentCut.current = 0;
        playCurrentCut();
      } else {
        playerRef.current.pauseVideo();
        clearInterval(intervalRef.current!);
        setIsFinished(true);
        setIsPlaying(false);
      }
      return;
    }

    playerRef.current.unMute?.();
    playerRef.current.seekTo(current.start, true);
    playerRef.current.playVideo();

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const currentTime = playerRef.current.getCurrentTime();
      const cut = cuts[currentCut.current];
      if (!cut) {
        playerRef.current.pauseVideo();
        clearInterval(intervalRef.current!);
        setIsFinished(true);
        setIsPlaying(false);
        return;
      }

      if (currentTime >= cut.end) {
        currentCut.current++;
        playCurrentCut();
      }
    }, 300); 
  };

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

  const handleAutoLoop = (checked: boolean) => {
    setLoop(checked);

    if (checked && isFinished) {
      startCutLoop();
    }
  }

  const handleGenerateShareLink = () => {
    if (cuts.length === 0) {
      toast.error('Add at least one Cut first');
      setShareUrl('');
      return;
    }

    const link = buildShareUrl(cuts, videoId);
    
    setShareUrl(link);
    navigator.clipboard.writeText(link);
    toast.success('Copied Share Link');
    return link;
  };

  return (
    <>
      <h1 className="text-xl mb-4 font-bold">Paste a YouTube URL</h1>
  
      <input
        type="text"
        onChange={handleUrlPasteChange}
        className="w-full p-2 border rounded mb-4"
        placeholder="Paste or type YouTube URL or Video ID here"
      />
  
      {videoId && (
        <div className="flex flex-col items-center gap-4">
          <div className="aspect-[16/9] w-full max-w-3xl">
            <div id="ytplayer" className="w-full h-full rounded-md" />
          </div>

          <div className="flex items-center">
            <Button
              variant='outline'
              onClick={startCutLoop}
              className='cursor-pointer'
            >
              ▶️ Play Loop
            </Button>

            <div className="flex items-center gap-2 ml-4">
              <Switch
                checked={loop}
                onCheckedChange={(checked) => handleAutoLoop(checked)}
                id="loop-switch"
                className='cursor-pointer'
              />
              <Label htmlFor="loop-switch" className="text-sm text-gray-700">
              🔁 Auto Loop
              </Label>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="font-semibold mb-2 mt-4">Add a Cut</h2>
            <div className="flex gap-2 items-center max-sm:flex-col">
              <input
                type="text"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                placeholder="Start (mm:ss/s)"
                className="flex-1 p-2 border rounded"
              />
              <input
                type="text"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                placeholder="End (mm:ss/s)"
                className="flex-1 p-2 border rounded"
              />
              <Button
                onClick={addCutFunc}
                variant='outline'
                className='cursor-pointer'
              >
                ➕ Add
              </Button>
            </div>

            {cuts.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-700 mb-4 mt-2 space-y-2">
                {cuts.map((c, i) => (
                  <li key={i} className="flex justify-center items-center">
                    <span>
                      {secondsToTimestamp(c.start)} → {secondsToTimestamp(c.end)}
                    </span>
                    <Button
                      onClick={() => removeCut(i)}
                      variant='ghost'
                      size='icon'
                      className='ml-2 cursor-pointer'
                    >
                      ❌
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center justify-center mt-10 space-x-4">
              <Button
                onClick={handleGenerateShareLink}
                variant='outline'
                className='cursor-pointer'
              >
                🔗 Generate Share Link
              </Button>
              <SaveLoopButton />
            </div>

            {/* {shareUrl && (
              <div className="mt-2 text-sm break-all text-gray-800">{shareUrl}</div>
            )} */}
          </div>
        </div>
      )}
    </>
  ); 
}
