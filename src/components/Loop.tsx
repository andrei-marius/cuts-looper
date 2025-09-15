import { Loop as LoopType } from '@/app/lib/types';
import Link from 'next/link';
import { formatTime } from '@/app/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SquarePen, Trash2, MoveRight, EllipsisVertical } from 'lucide-react';

interface Props {
  loop: LoopType;
  onEdit: (l: LoopType) => void;
  onDelete: (l: LoopType) => void;
}

export default function Loop({ loop, onEdit, onDelete }: Props) {
  return (
    <tr key={loop.id}>
      <td className="border px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button variant="ghost">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onEdit(loop)}>
              <SquarePen className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(loop)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
      <td className="border px-4 py-2">{loop.name}</td>
      <td className="border px-4 py-2">
        <Link
          href={loop.share_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Open Link
        </Link>
      </td>
      <td className="border px-4 py-2 whitespace-pre-wrap max-w-xs text-sm text-gray-800">
        <ul className="space-y-1">
          {loop.cuts.map((cut: any, i: number) => (
            <li key={i} className="flex items-center">
              {formatTime(cut.start)}
              <MoveRight className="inline w-4 h-4 mx-1" />
              {formatTime(cut.end)}
            </li>
          ))}
        </ul>
      </td>
      <td className="border px-4 py-2">
        {formatDistanceToNow(new Date(loop.created_at), { addSuffix: true })}
        <br />({new Date(loop.created_at).toLocaleString()})
      </td>
    </tr>
  );
}
