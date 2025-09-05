'use server';

import db from '@/app/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function getLoops() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    return { error: 'Internal error occured.' };
  }

  const { data, error } = await db
    .from('loop')
    .select('id, name, share_url, cuts, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: 'Internal error loading loops.' };
  }

  return { data };
}
