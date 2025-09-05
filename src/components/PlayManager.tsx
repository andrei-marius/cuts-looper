'use client';

import { useState, useRef, SetStateAction, Dispatch, RefObject } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import toast from 'react-hot-toast';
import { useStore } from '@/app/lib/store';

interface Props {
  playerRef: RefObject<YT.Player | null>;
  currentCut: RefObject<number>;
  intervalRef: RefObject<ReturnType<typeof setInterval> | null>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

export default function PlayManager({ playerRef, currentCut, intervalRef, setIsPlaying }: Props) {
  const [isFinished, setIsFinished] = useState(false);
  const [loop, _setLoop] = useState(false);
  const loopRef = useRef(false);

  const setLoop = (val: boolean) => {
    loopRef.current = val;
    _setLoop(val);
  };

  const { cuts } = useStore();

  const handleAutoLoop = (checked: boolean) => {
    setLoop(checked);

    if (checked && isFinished) {
      startCutLoop();
    }
  };

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
    if (playerRef && playerRef.current) {
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
        if (playerRef && playerRef.current) {
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
        }
      }, 300);
    }
  };

  return (
    <div className="flex items-center">
      <Button variant="outline" onClick={startCutLoop} className="cursor-pointer">
        ▶️ Play Loop
      </Button>

      <div className="flex items-center gap-2 ml-4">
        <Switch
          checked={loop}
          onCheckedChange={(checked) => handleAutoLoop(checked)}
          id="loop-switch"
          className="cursor-pointer"
        />
        <Label htmlFor="loop-switch" className="text-sm text-gray-700">
          🔁 Auto Loop
        </Label>
      </div>
    </div>
  );
}
