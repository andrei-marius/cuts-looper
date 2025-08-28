'use server'

import db from '@/app/lib/db';

export default async function editLoop(id: string, name: string) {
  if (!id || !name) return { msg: 'Internal error'};

  const { error } = await db
    .from("loop")
    .update({ name: name })
    .eq("id", id);

  if (error) return { msg: 'Error editing loop' };
    
  return { msg: 'Loop edited' };
}

