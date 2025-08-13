'use client';

import { useState, useActionState, startTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { useStore } from '@/app/lib/store';
import { Loader2 } from 'lucide-react';
import { buildShareUrl } from '@/app/lib/utils';
import { saveLoop } from '@/app/actions/saveLoop';

export function SaveLoopButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const { cuts, shareUrl, videoId, setShareUrl, clearCuts } = useStore();
  const [state, actionSaveLoop, pending] = useActionState(saveLoop, { msg: '' })

  const handleSaveClick = () => {
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

    const link = buildShareUrl(cuts, videoId);
    setShareUrl(link);

    actionSaveLoop({ name, cuts, link })
  
    toast.success(state.msg);
    setDialogOpen(false);
    clearCuts();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {/* <DialogTrigger asChild> */}
        <Button 
          onClick={handleSaveClick} 
          variant="outline"
          className='cursor-pointer'
        >
          💾 Save
        </Button>
      {/* </DialogTrigger> */}
      <DialogContent className="sm:max-w-md">
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
          onClick={() => startTransition(handleSave)} 
          disabled={pending}
          className='cursor-pointer'
          variant='outline'
        >
            {pending ? (
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
  );
}
