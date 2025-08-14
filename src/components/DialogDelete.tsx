'use client'

import { useActionState, startTransition, useEffect } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useStore } from "@/app/lib/store";
import { Button } from "./ui/button";
import { deleteLoop } from "@/app/actions/deleteLoop";
import { Loop } from "@/app/lib/types";
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function DialogDelete() {
  const { dialogDeleteOpen, setDialogDeleteOpen, selectedLoop, setLoops } = useStore()
  const [state, actionDeleteLoop, pending] = useActionState(deleteLoop, { msg: '' })

  useEffect(() => {
    if (state.status === 'success') {
      if (!selectedLoop) return;
      
      const { id } = selectedLoop
      
      setLoops(prev => prev.filter(loop => loop.id !== id));
      
      setDialogDeleteOpen(false);

      toast.success(state.msg);
    } else if (state.status === 'fail') {
      toast.error(state.msg);
    }
  }, [state]);

  async function handleDelete() {
    if (!selectedLoop) return;

    const { id } = selectedLoop

    startTransition(() => {
      actionDeleteLoop({ id })       
    })     
  }

  return (
    <Dialog open={dialogDeleteOpen} onOpenChange={setDialogDeleteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Loop</DialogTitle>
        </DialogHeader>

        <p>Are you sure you want to delete <strong>{selectedLoop?.name}</strong>?</p>

        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => setDialogDeleteOpen(false)}
            className='cursor-pointer'
          >
            Cancel
          </Button>
          <Button
            className='cursor-pointer'
            variant="destructive"
            onClick={handleDelete} 
          >
            {pending ? (
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
  )
}