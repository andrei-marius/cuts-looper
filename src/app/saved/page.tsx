'use client';

import { Loop } from '@/app/lib/types';
import SearchAndSort from '@/components/SearchAndSort';
import useSearchAndSort from '@/app/hooks/useSearchAndSort';
import { useStore } from '@/app/lib/store';
import DialogDelete from '@/components/DialogDelete';
import DialogEdit from '@/components/DialogEdit';
import SkeletonLoop from '@/components/SkeletonLoop';
import useAuth from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { usePaginatedLoops } from '@/app/hooks/usePaginatedLoops';
import LoopRow from '@/components/Loop';
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function Saved() {
  const { searchTerm, sortOrder, setDialogDeleteOpen, setDialogEditOpen, setSelectedLoop } =
    useStore();
  const { isAuthenticated } = useAuth();

  const {
    loops,
    error,
    isLoading,
    currentPage,
    pageCount,
    handleNextPage,
    handlePreviousPage,
    handlePageChange,
  } = usePaginatedLoops(5);

  const filteredSortedLoops = useSearchAndSort({
    searchTerm,
    sortOrder,
    loops,
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
          {isLoading ? (
            <SkeletonLoop />
          ) : loops.length === 0 ? (
            <p className="text-center">No saved loops.</p>
          ) : (
            <>
              <h1 className="text-xl font-semibold mb-4">Saved Loops</h1>

              <SearchAndSort />

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
                    {filteredSortedLoops.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          No loops match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredSortedLoops.map((loop: Loop) => (
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

              {pageCount > 1 && (
                <div className="mt-4 flex justify-center">
                  <PaginationUI>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={handlePreviousPage}
                          aria-disabled={currentPage === 1}
                          className={
                            currentPage === 1
                              ? 'pointer-events-none opacity-50 cursor-default'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: pageCount }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={currentPage === i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={handleNextPage}
                          aria-disabled={currentPage === pageCount}
                          className={
                            currentPage === pageCount
                              ? 'pointer-events-none opacity-50 cursor-default'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </PaginationUI>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <DialogDelete />
      <DialogEdit />
    </>
  );
}

