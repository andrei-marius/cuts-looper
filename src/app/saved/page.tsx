'use client';

import { Button } from "@/components/ui/button";
import { formatTime } from '@/app/lib/utils';
import Link from 'next/link';
import { Loop } from '@/app/lib/types';
import SearchAndSort from '@/components/SearchAndSort';
import useSearchAndSort from '@/app/hooks/useSearchAndSort';
import { useStore } from '@/app/lib/store';
import DialogDelete from '@/components/DialogDelete';
import DialogEdit from '@/components/DialogEdit';
import { useQuery } from '@tanstack/react-query';
import SkeletonLoop from '@/components/SkeletonLoop';
import getLoops from '../actions/getLoops';

export default function Saved() {
  const { searchTerm, sortOrder, setDialogDeleteOpen, setDialogEditOpen, setSelectedLoop } = useStore();

  const { data: loops, error, isLoading } = useQuery({
    queryKey: ['loops'],
    queryFn: getLoops,
  });

  const filteredSortedLoops = useSearchAndSort({
    searchTerm,
    sortOrder,
    loops: loops ?? [],
  });


  function handleDelete(loop: Loop) {
    setDialogDeleteOpen(true)
    setSelectedLoop(loop)
  }

  function handleEdit(loop: Loop) {
    setDialogEditOpen(true)
    setSelectedLoop(loop)
  }

  if (error) return <p className="p-4 text-center">Error loading saved loops.</p>;

  return (
    <>
      <div className="p-4">
        <div className="overflow-x-auto max-w-full">
          {isLoading || !loops ? (
            <SkeletonLoop />
          ) : loops.length === 0 ? (
            <p className="text-center text-gray-500">No saved loops.</p>
          ) : (
            <>
              <h1 className="text-xl font-semibold mb-4">Saved Loops</h1>

              <SearchAndSort />

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
                          <Link href={loop.share_url} target="_blank" rel="noopener noreferrer" className="underline">
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
                        <td className="border px-4 py-2">{new Date(loop.created_at).toLocaleString()}</td>
                        <td className="border px-4 py-2 space-x-2">
                          <Button onClick={() => handleEdit(loop)} variant="outline" className="cursor-pointer">
                            ✏️ Edit
                          </Button>
                          <Button onClick={() => handleDelete(loop)} variant="outline" className="cursor-pointer">
                            🗑️ Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      <DialogDelete />
      <DialogEdit />
    </>
  );
}
