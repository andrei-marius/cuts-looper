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
import { editLoop } from "@/app/actions/editLoop";
import { Loop } from "@/app/lib/types";
import { Input } from "./ui/input";
import { Loader2 } from 'lucide-react';

export function DialogEdit() {
  const { dialogEditOpen, setDialogEditOpen, selectedLoop, setSelectedLoop, setLoops } = useStore()
    const [state, actionEditLoop, pending] = useActionState(editLoop, { msg: '' })

  async function handleEdit() {
    if (!selectedLoop) return;

    const { id, name } = selectedLoop
    
    actionEditLoop({ id, name })        
    
    setDialogEditOpen(false);
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
            onClick={() => startTransition(handleEdit)}
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