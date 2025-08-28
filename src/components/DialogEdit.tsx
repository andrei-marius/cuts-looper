'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/app/lib/store";
import { Button } from "./ui/button";
import editLoop from "@/app/actions/editLoop";
import { Loop } from "@/app/lib/types";
import { Input } from "./ui/input";
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function DialogEdit() {
  const { dialogEditOpen, setDialogEditOpen, selectedLoop, setSelectedLoop } = useStore()
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedLoop) throw new Error("Internal error");

      const { id, name } = selectedLoop

      return editLoop(id, name );
    },
    onSuccess: (res) => {
      toast.success(res.msg);
      queryClient.invalidateQueries({ queryKey: ["loops"] });
      setDialogEditOpen(false);
    },
    onError: () => {
      toast.error("Error editing loop");
    }
  });

  return (
    <Dialog open={dialogEditOpen} onOpenChange={setDialogEditOpen}>
      <DialogContent 
        className='
          sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 
          sm:rounded-lg
          fixed bottom-0 left-0 right-0 sm:bottom-auto
          rounded-t-2xl
          max-h-[80dvh] overflow-y-auto
        '
      >
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
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
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