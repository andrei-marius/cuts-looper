'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';
import { Loader2 } from 'lucide-react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { buildShareUrl } from '@/lib/utils';

export function SaveLoopButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { cuts, shareUrl, videoId, setShareUrl, clearCuts } = useStore();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useKindeBrowserClient();

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      toast.error('You need to Log in first');
      return;
    }

    if (!cuts.length) {
      toast.error('Add at least one Cut first');
      return;
    }
    
    setOpen(true);
  }

  const handleSave = async () => {
    const link = buildShareUrl(cuts, videoId);

    setShareUrl(link);

    if (!name) {
      toast.error('Missing Name');
      return;
    }

    setLoading(true);

    if (user) {
      try {
          const { error } = await db.from('loop').insert([
              {
                user_id: user.id,
                name,
                cuts,
                share_url: link
              },
          ]);
  
          if (error) throw error;
  
          toast.success('Loop saved');
      } catch (err: any) {
          toast.error(err.message || 'Failed to save');
      } finally {
          setLoading(false);
          setOpen(false);
          clearCuts();
      }
    }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <DialogFooter>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className='cursor-pointer'
          variant='outline'
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                Saving...
                </div>
            ) : (
                'Save'
            )}
        </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
