import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Cut } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
}

export const buildShareUrl = (cuts: Cut[], videoId: string | null) => {
  const cutsParam = encodeURIComponent(JSON.stringify(cuts));
  const url = `${window.location.origin}?v=${videoId}&cuts=${cutsParam}`;

  return url;
};

const safeParseUrl = (str: string): URL | null => {
  try {
    return new URL(str);
  } catch {
    return null;
  }
};

export const extractVideoId = (input: string): string | null => {
  const trimmed = input.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const url = safeParseUrl(trimmed);
  if (!url) return null;

  if (url.hostname.includes('youtube.com')) {
    return url.searchParams.get('v');
  } else if (url.hostname === 'youtu.be') {
    return url.pathname.slice(1);
  }

  return null;
};
