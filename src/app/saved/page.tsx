'use client';

import { Loop } from '@/app/lib/types';
import SearchAndSort from '@/components/SearchAndSort';
import useSearchAndSort from '@/app/hooks/useSearchAndSort';
import { useStore } from '@/app/lib/store';
import DialogDelete from '@/components/DialogDelete';
import DialogEdit from '@/components/DialogEdit';
import { useQuery } from '@tanstack/react-query';
import SkeletonLoop from '@/components/SkeletonLoop';
import useAuth from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import LoopRow from '@/components/Loop';

async function getLoops(): Promise<Loop[]> {
  const res = await fetch('/api/loops');

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Failed to fetch loops');
  }

  const { data } = (await res.json()) as { data: Loop[] };
  return data;
}

export default function Saved() {
  const { searchTerm, sortOrder, setDialogDeleteOpen, setDialogEditOpen, setSelectedLoop } =
    useStore();
  const { isAuthenticated } = useAuth();

  const {
    data: loops,
    error,
    isLoading,
  } = useQuery<Loop[], Error>({
    queryKey: ['loops'],
    queryFn: getLoops,
  });

  const filteredSortedLoops = useSearchAndSort({
    searchTerm,
    sortOrder,
    loops: loops ?? [],
  });

  function handleDelete(loop: Loop) {
    setDialogDeleteOpen(true);
    setSelectedLoop(loop);
  }

  function handleEdit(loop: Loop) {
    setDialogEditOpen(true);
    setSelectedLoop(loop);
  }

  if (isAuthenticated === null) return <Loader2 className="animate-spin h-10 w-10 mx-auto mt-8" />;

  if (!isAuthenticated)
    return <p className="p-4 text-center">You need to be logged in to view saved loops.</p>;

  if (error) return <p className="p-4 text-center">{error.message}</p>;

  return (
    <>
      <div className="p-4">
        <div className="max-w-full">
          {isLoading || !loops ? (
            <SkeletonLoop />
          ) : loops.length === 0 ? (
            <p className="text-center">No saved loops.</p>
          ) : (
            <>
              <h1 className="text-xl font-semibold mb-4">Saved Loops</h1>

              <SearchAndSort />

              <Pagination
                data={filteredSortedLoops}
                itemsPerPage={5}
                render={(paginatedLoops) => (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-4 py-2 w-10"></th>
                          <th className="border px-4 py-2 text-left">Name</th>
                          <th className="border px-4 py-2 text-left">Share URL</th>
                          <th className="border px-4 py-2 text-left">Cuts</th>
                          <th className="border px-4 py-2 text-left">Created at</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedLoops.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500">
                              No loops match your search.
                            </td>
                          </tr>
                        ) : (
                          paginatedLoops.map((loop: Loop) => (
                            <LoopRow
                              key={loop.id}
                              loop={loop}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              />
            </>
          )}
        </div>
      </div>

      <DialogDelete />
      <DialogEdit />
    </>
  );
}
