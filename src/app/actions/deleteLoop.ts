'use server'

import db from '@/app/lib/db';

export default async function deleteLoop(id: string) {
  if (!id) return { msg: 'Internal error'};

  const { error } = await db
    .from("loop")
    .delete()
    .eq("id", id);

  if (error) return { msg: 'Error deleting loop' };

  return { msg: 'Loop deleted' };
}