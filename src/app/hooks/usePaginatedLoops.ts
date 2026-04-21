'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loop } from '@/app/lib/types';

type PaginatedResponse = {
  data: Loop[];
  total: number;
  pageCount: number;
};

async function getPaginatedLoops(page: number, limit: number): Promise<PaginatedResponse> {
  const res = await fetch(`/api/loops?page=${page}&limit=${limit}`);

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Failed to fetch loops');
  }

  return res.json();
}

export function usePaginatedLoops(itemsPerPage = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paginationData,
    error,
    isLoading,
  } = useQuery<PaginatedResponse, Error>({
    queryKey: ['loops', currentPage, itemsPerPage],
    queryFn: () => getPaginatedLoops(currentPage, itemsPerPage),
  });

  const loops = paginationData?.data ?? [];
  const pageCount = paginationData?.pageCount ?? 0;
  const total = paginationData?.total ?? 0;

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pageCount) {
      setCurrentPage(page);
    }
  };

  return {
    loops,
    error,
    isLoading,
    currentPage,
    pageCount,
    total,
    handleNextPage,
    handlePreviousPage,
    handlePageChange,
  };
}
