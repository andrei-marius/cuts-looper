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
}

export default function ShareAndSave({ videoId, setVideoId }: Props) {
  const { cuts, setShareUrl } = useStore()
  
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
    <div className="flex items-center justify-center mt-10 space-x-4">
      <Button
        onClick={handleGenerateShareLink}
        variant='outline'
        className='cursor-pointer'
      >
        🔗 Generate Share Link
      </Button>

      <SaveLoop videoId={videoId} setVideoId={setVideoId} />
    </div>
  )
}