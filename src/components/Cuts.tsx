'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { timestampToSeconds, secondsToTimestamp } from '@/app/lib/utils';
import { useStore } from '@/app/lib/store';
import { Button } from './ui/button';
import { Plus, X, MoveRight } from 'lucide-react';

export default function Cuts() {
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const { setShareUrl, addCut, removeCut, cuts } = useStore();

  const addCutFunc = () => {
    const s = timestampToSeconds(newStart);
    const e = timestampToSeconds(newEnd);
    if (!isNaN(s) && !isNaN(e) && s < e) {
      addCut({ start: s, end: e });
      setNewStart('');
      setNewEnd('');
      setShareUrl('');
    } else {
      toast.error('Invalid timestamp format or start >= end');
    }
  };

  return (
    <>
      <h2 className="font-semibold mb-2 mt-4">Add a Cut</h2>
      <div className="flex gap-2 items-center max-sm:flex-col">
        <input
          type="text"
          value={newStart}
          onChange={(e) => setNewStart(e.target.value)}
          placeholder="Start (mm:ss/s)"
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          value={newEnd}
          onChange={(e) => setNewEnd(e.target.value)}
          placeholder="End (mm:ss/s)"
          className="flex-1 p-2 border rounded"
        />
        <Button onClick={addCutFunc} variant="outline" className="cursor-pointer">
          <Plus />
          Add
        </Button>
      </div>

      {cuts.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-700 mb-4 mt-2 space-y-2">
          {cuts.map((c, i) => (
            <li key={i} className="flex justify-center items-center mb-0">
              {secondsToTimestamp(c.start)}
              <MoveRight className="inline w-4 h-4 mx-1" />
              {secondsToTimestamp(c.end)}
              <Button
                onClick={() => removeCut(i)}
                variant="ghost"
                size="icon"
                className="ml-2 cursor-pointer hover:bg-red-50"
              >
                <X color="red" strokeWidth={3} />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
