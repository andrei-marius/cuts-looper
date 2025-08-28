'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useStore } from '@/app/lib/store';
import { Input } from './ui/input';

export default function SearchAndSort() {
  const { searchTerm, setSearchTerm, sortOrder, setSortOrder } = useStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search by Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10'
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
  )
}