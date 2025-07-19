// global.d.ts
export {}; // ensures this is a module, so augmentation works

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
