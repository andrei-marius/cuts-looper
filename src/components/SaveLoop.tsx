'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { useStore } from '@/app/lib/store';
import { Loader2, Save } from 'lucide-react';
import { buildShareUrl } from '@/app/lib/utils';
import saveLoop from '@/app/actions/saveLoop';
import { useMutation } from '@tanstack/react-query';
import useAuth from '@/app/hooks/useAuth';

interface Props {
  videoId: string;
  setVideoId: Dispatch<SetStateAction<string>>;
  setUrl: Dispatch<SetStateAction<string>>;
}

export default function SaveLoop({ videoId, setVideoId, setUrl }: Props) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const { cuts, setShareUrl, clearCuts } = useStore();
  const { isAuthenticated } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      const url = buildShareUrl(cuts, videoId);
      setShareUrl(url);
      return saveLoop(name, cuts, url);
    },
    onSuccess: (res) => {
      setDialogOpen(false);
      toast.success(res.msg);
      clearCuts();
      setName('');
      setVideoId('');
      setUrl('');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleClickOpenSave = async () => {
    if (!isAuthenticated) {
      toast.error('You need to be logged in to save loops');
      return;
    }

    if (!cuts.length) {
      toast.error('Add at least one Cut first');
      return;
    }

    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name) {
      toast.error('Missing Name');
      return;
    }

    mutation.mutate();
  };

  return (
    <>
      <Button onClick={handleClickOpenSave} variant="outline" className="cursor-pointer">
        <Save />
        Save
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-md:top">
          <DialogHeader>
            <DialogTitle>Save Your Loop</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Enter a Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => setDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={mutation.isPending}
              className="cursor-pointer"
              variant="outline"
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
