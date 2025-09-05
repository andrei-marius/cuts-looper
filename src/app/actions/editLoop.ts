'use server';

import db from '@/app/lib/db';

export default async function editLoop(id: string, name: string) {
  if (!id || !name) return { msg: 'Internal Error' };

  const { error } = await db.from('loop').update({ name: name }).eq('id', id);

  if (error) return { msg: 'Error Editing Loop' };

  return { msg: 'Loop Edited' };
}
