'use server'

import { db } from '@/app/lib/db';
import { revalidatePath } from 'next/cache'

export async function deleteLoop(
  _prevState: { msg: string } | undefined,
  payload: { id: string }
) {
  const { id } = payload

  if (!id) return;

  const { error } = await db.from("loop").delete().eq("id", id);

  if (error) return { msg: 'Error deleting loop' };

  revalidatePath('/saved')

  return { msg: 'Loop deleted' };
}