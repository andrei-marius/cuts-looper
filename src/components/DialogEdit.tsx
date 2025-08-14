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
import { editLoop } from "@/app/actions/editLoop";
import { Loop } from "@/app/lib/types";
import { Input } from "./ui/input";
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function DialogEdit() {
  const { dialogEditOpen, setDialogEditOpen, selectedLoop, setSelectedLoop, setLoops } = useStore()
  const [state, actionEditLoop, pending] = useActionState(editLoop, { msg: '' })

  useEffect(() => {
    if (state.status === 'success') {
      if (!selectedLoop) return;
      
      const { id, name } = selectedLoop
      
      setLoops((prev) => prev.map((loop) =>
      loop.id === id ? { ...loop, name } : loop
      ));
      
      setDialogEditOpen(false);

      toast.success(state.msg);
    } else if (state.status === 'fail') {
      toast.error(state.msg);
    }
  }, [state]);
    
  async function handleEdit() {
    if (!selectedLoop) return;

    const { id, name } = selectedLoop
    
    startTransition(() => {
      actionEditLoop({ id, name })        
    })
  }

  return (
    <Dialog open={dialogEditOpen} onOpenChange={setDialogEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Loop Name</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={selectedLoop?.name}
            onChange={(e) =>
              setSelectedLoop({ ...(selectedLoop as Loop), name: e.target.value })
            }
          />
        </div>

        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => setDialogEditOpen(false)}
            className='cursor-pointer'
          >
            Cancel
          </Button>
          <Button
            className='cursor-pointer'
            onClick={handleEdit}
          >
            {pending ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                Editing...
                </div>
            ) : (
                'Edit'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}