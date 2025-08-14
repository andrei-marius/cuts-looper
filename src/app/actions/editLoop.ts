'use server'

import { db } from '@/app/lib/db';
import { revalidatePath } from 'next/cache'

export async function editLoop(
  _prevState: { msg: string } | undefined,
  payload: { id: string, name: string }
) {
  const { id, name } = payload

  if (!id) return { msg: 'Internal error'};

  const { error } = await db
    .from("loop")
    .update({ name: name })
    .eq("id", id);

  if (error) return { status: 'fail', msg: 'Error editing loop' };
  
  revalidatePath('/saved')
  
  return { status: 'success', msg: 'Loop edited' };
}

