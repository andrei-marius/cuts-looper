'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { useStore } from '@/app/lib/store';
import { Loader2 } from 'lucide-react';
import { buildShareUrl } from '@/app/lib/utils';
import saveLoop from '@/app/actions/saveLoop';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  videoId: string;
  setVideoId: Dispatch<SetStateAction<string>>;
}

export default function SaveLoop({ videoId, setVideoId }: Props) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const { cuts, shareUrl, setShareUrl, clearCuts } = useStore();
  const { isAuthenticated, isLoading } = useKindeBrowserClient()
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const link = buildShareUrl(cuts, videoId);
      setShareUrl(link);
      return saveLoop(name, cuts, link)
    },
    onSuccess: (res) => {
        toast.success(res.msg);
        queryClient.invalidateQueries({ queryKey: ["loops"] });
        setDialogOpen(false);
        clearCuts();
        setName('')
        setVideoId('')
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      toast.error('You need to log in to save loops');
      return;
    }

    if (!cuts.length) {
      toast.error('Add at least one Cut first');
      return;
    }
    
    setDialogOpen(true);
  }

  const handleSave = async () => {
    if (!name) {
      toast.error('Missing Name');
      return;
    }

    mutation.mutate()
  };

  return (
    <>
      <Button 
        onClick={handleSaveClick} 
        variant="outline"
        className='cursor-pointer'
      >
        💾 Save
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent 
          className='
            sm:max-w-md
            sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 
            sm:rounded-lg
            fixed bottom-0 left-0 right-0 sm:bottom-auto
            rounded-t-2xl
            max-h-[80dvh] overflow-y-auto
          '
        >
          <DialogHeader>
            <DialogTitle>Save Your Loop</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Enter a name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => setDialogOpen(false)}
            className='cursor-pointer'
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={mutation.isPending}
            className='cursor-pointer'
            variant='outline'
          >
              {mutation.isPending ? (
                  <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                  Saving...
                  </div>
              ) : (
                  'Save'
              )}
          </Button>

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
