'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStore } from '@/app/lib/store';
import { Button } from './ui/button';
import deleteLoop from '@/app/actions/deleteLoop';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function DialogDelete() {
  const { dialogDeleteOpen, setDialogDeleteOpen, selectedLoop } = useStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedLoop) throw new Error('Internal Error');
      return deleteLoop(selectedLoop.id);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['loops'] });
      setDialogDeleteOpen(false);
      toast.success(res.msg);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Dialog open={dialogDeleteOpen} onOpenChange={setDialogDeleteOpen}>
      <DialogContent className="max-md:top">
        <DialogHeader>
          <DialogTitle>Delete Loop</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete <strong>{selectedLoop?.name}</strong>?
        </p>

        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => setDialogDeleteOpen(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                Deleting...
              </div>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
