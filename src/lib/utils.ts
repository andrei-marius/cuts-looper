import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useStore } from "./store";
import toast from 'react-hot-toast';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timestampToSeconds(timestamp: string): number {
  const parts = timestamp.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parseFloat(timestamp);
}

export function secondsToTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const generateLink = () => {
  const { cuts, videoId, setShareUrl } = useStore.getState();

  if (cuts.length === 0) {
    toast.error('Add at least one Cut first');
    setShareUrl('');
    return;
  }

  const cutsParam = encodeURIComponent(JSON.stringify(cuts));
  const link = `${window.location.origin}?v=${videoId}&cuts=${cutsParam}`;
  setShareUrl(link);
  navigator.clipboard.writeText(link);
  toast.success('Copied Share Link');
  return link;
};

export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
}
