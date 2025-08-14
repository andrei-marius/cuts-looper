'use client'

import { useDebounce } from "./useDebounce";
import { useMemo } from "react";
import { useStore } from "@/app/lib/store";

interface Props {
  searchTerm: string;
  sortOrder: "newest" | "oldest";
}

export function useSearchAndSort({ searchTerm, sortOrder }: Props) {
  const { loops } = useStore();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredSortedLoops = useMemo(() => {
    if (!loops) return [];

    let filteredSorted = loops;

    // Search
    if (debouncedSearchTerm.trim() !== "") {
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      filteredSorted = filteredSorted.filter((loop) =>
        loop.name.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort
    return filteredSorted.slice().sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [loops, debouncedSearchTerm, sortOrder]);

  return filteredSortedLoops;
}
