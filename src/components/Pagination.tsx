'use client';

import { useState, PropsWithChildren } from 'react';
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type Props<T> = {
  data: T[];
  itemsPerPage?: number;
  render: (items: T[]) => React.ReactNode;
};

export default function Pagination<T>({
  data,
  itemsPerPage = 5,
  render,
}: PropsWithChildren<Props<T>>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      {render(paginatedData)}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <PaginationUI>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1
                      ? 'pointer-events-none opacity-50 cursor-default'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
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
  );
}
