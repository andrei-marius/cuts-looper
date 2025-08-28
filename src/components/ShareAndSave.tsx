'use client'

import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button"
import SaveLoop from "./SaveLoop"
import { useStore } from "@/app/lib/store";
import toast from "react-hot-toast";
import { buildShareUrl } from '@/app/lib/utils';

interface Props {
  videoId: string;
  setVideoId: Dispatch<SetStateAction<string>>;
  setUrl: Dispatch<SetStateAction<string>>;
}

export default function ShareAndSave({ videoId, setVideoId, setUrl }: Props) {
  const { cuts, setShareUrl } = useStore()
  
  const handleGenerateShareUrl = () => {
    if (cuts.length === 0) {
      toast.error('Add at least one Cut first');
      setShareUrl('');
      return;
    }

    const url = buildShareUrl(cuts, videoId);
    
    setShareUrl(url);
    navigator.clipboard.writeText(url);
    toast.success('Copied Share URL');
    return url;
  };
  
  return (
    <div className="flex items-center justify-center mt-10 space-x-4">
      <Button
        onClick={handleGenerateShareUrl}
        variant='outline'
        className='cursor-pointer'
      >
        🔗 Generate Share URL
      </Button>

      <SaveLoop 
        videoId={videoId} 
        setVideoId={setVideoId}
        setUrl={setUrl}
      />
    </div>
  )
}