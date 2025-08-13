'use client'

import { useActionState, startTransition } from 'react'
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

export function DialogDelete() {
  const { dialogDeleteOpen, setDialogDeleteOpen, selectedLoop, setLoops } = useStore()
  const [state, actionDeleteLoop, pending] = useActionState(deleteLoop, { msg: '' })

  async function handleDelete() {
    if (!selectedLoop) return;

    const { id } = selectedLoop

    actionDeleteLoop({ id })       
     
    setDialogDeleteOpen(false);
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
            onClick={() => startTransition(handleDelete)} 
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