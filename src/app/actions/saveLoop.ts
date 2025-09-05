'use server';

import db from '@/app/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Cut } from '../lib/types';

export default async function saveLoop(name: string, cuts: Cut[], url: string) {
  if (!name || !cuts || !url) return { msg: 'Internal Error' };

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) throw new Error('Internal Error');

  const { error } = await db.from('loop').insert([
    {
      user_id: user.id,
      name: name,
      cuts: cuts,
      share_url: url,
    },
  ]);

  if (error) throw new Error('Error Saving Loop');

  return { msg: 'Loop Saved' };
}
