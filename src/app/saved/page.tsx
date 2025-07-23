'use client';

import { useEffect, useState, useMemo } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { db } from '@/lib/db';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '../hooks/useDebounce';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatTime } from '@/lib/utils';
import Link from 'next/link';
import { Loader2, Search } from 'lucide-react';
import { Loop } from '@/lib/types';

function SkeletonRow() {
  return (
    <tr>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <td key={i} className="border px-4 py-2">
            <div className="h-4 bg-gray-300 rounded animate-pulse w-full max-w-[100px]" />
          </td>
        ))}
    </tr>
  );
}

export default function Saved() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useKindeBrowserClient();
  const [loops, setLoops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [editingLoop, setEditingLoop] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loopToDelete, setLoopToDelete] = useState<any | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchLoops = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
  
      const { data, error } = await db
        .from('loop')
        .select('id, name, share_url, cuts, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
  
      if (error) {
        console.error('Error fetching saved loops:', error.message);
      } else {
        setLoops(data || []);
      }
  
      setLoading(false);
    };
  
    if (!isAuthLoading && user?.id) {
      fetchLoops();
    }
  }, [user?.id, isAuthLoading]);
  
  function handleEdit(loop: any) {
    setEditingLoop(loop);
    setDialogOpen(true);
  }

  function openDeleteDialog(loop: any) {
    setLoopToDelete(loop);
    setDeleteDialogOpen(true);
  }

  const filteredSortedLoops = useMemo(() => {
    let filtered = loops;

    if (debouncedSearchTerm.trim() !== '') {
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((loop) =>
        loop.name.toLowerCase().includes(lowerSearch)
      );
    }

    filtered = filtered.slice().sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [loops, debouncedSearchTerm, sortOrder]);

  // 1. Still checking auth
  if (isAuthLoading) {
    return (
        <Loader2 className="animate-spin h-10 w-10 mt-4 mx-auto" />
    );
  }

  // 2. Not authenticated
  if (!isAuthenticated || !user) {
    return <p className="p-4 text-center">You need to be logged in to view saved loops.</p>;
  }

  // 3. Authenticated but still loading data
  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Saved Loops</h1>
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Share URL</th>
              <th className="border px-4 py-2 text-left">Cuts</th>
              <th className="border px-4 py-2 text-left">Created At</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  // 4. No loops found
  if (loops.length === 0) {
    return <p className="p-4 text-center">No saved loops.</p>;
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Saved Loops</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded w-full"
            aria-label="Search loops by name"
          />
        </div>

          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest')}
          >
            <SelectTrigger className="w-full sm:w-40 cursor-pointer">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className='cursor-pointer' value="newest">Sort by Newest</SelectItem>
              <SelectItem className='cursor-pointer' value="oldest">Sort by Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Share URL</th>
                <th className="border px-4 py-2 text-left">Cuts</th>
                <th className="border px-4 py-2 text-left">Created at</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSortedLoops.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No loops match your search.
                  </td>
                </tr>
              ) : (
                filteredSortedLoops.map((loop: Loop) => (
                  <tr key={loop.id}>
                    <td className="border px-4 py-2">{loop.name}</td>
                    <td className="border px-4 py-2">
                    <Link 
                      href={loop.share_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      passHref
                      className='underline'
                    >
                      Open Link
                    </Link>
                    </td>
                    <td className="border px-4 py-2 whitespace-pre-wrap max-w-xs text-sm text-gray-800">
                      {Array.isArray(loop.cuts) && loop.cuts.length > 0 ? (
                        <ul className="space-y-1">
                          {loop.cuts.map((cut: any, i: number) => (
                            <li key={i}>
                              {formatTime(cut.start)} → {formatTime(cut.end)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500 italic">No cuts</span>
                      )}
                    </td>

                    <td className="border px-4 py-2">
                      {new Date(loop.created_at).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <Button
                        onClick={() => handleEdit(loop)}
                        variant='outline'
                        className='cursor-pointer max-md:gap-y max-md:gap-r'
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        onClick={() => openDeleteDialog(loop)}
                        variant='outline'
                        className='cursor-pointer max-md:gap-y'
                      >
                        🗑️ Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Loop</DialogTitle>
          </DialogHeader>

          <p>Are you sure you want to delete <strong>{loopToDelete?.name}</strong>?</p>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setDeleteDialogOpen(false)}
              className='cursor-pointer'
            >
              Cancel
            </Button>
            <Button
              className='cursor-pointer'
              variant="destructive"
              onClick={async () => {
                if (!loopToDelete) return;
                const { error } = await db.from("loop").delete().eq("id", loopToDelete.id);
                if (error) {
                  console.error("Delete failed:", error.message);
                } else {
                  setLoops((prev) => prev.filter((l) => l.id !== loopToDelete.id));
                  setDeleteDialogOpen(false);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Loop Name</DialogTitle>
          </DialogHeader>

          {editingLoop && (
            <div className="space-y-4">
              <Input
                value={editingLoop.name}
                onChange={(e) =>
                  setEditingLoop({ ...editingLoop, name: e.target.value })
                }
              />
            </div>
          )}

          <DialogFooter>
            <Button
              className='cursor-pointer'
              onClick={async () => {
                const { error } = await db
                  .from("loop")
                  .update({ name: editingLoop.name })
                  .eq("id", editingLoop.id);

                if (error) {
                  console.error("Update failed:", error.message);
                } else {
                  setLoops((prev) =>
                    prev.map((l) =>
                      l.id === editingLoop.id ? { ...l, name: editingLoop.name } : l
                    )
                  );
                  setDialogOpen(false);
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
