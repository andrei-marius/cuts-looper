'use server'

import db from '@/app/lib/db';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Cut } from '../lib/types';

export default async function saveLoop(name: string, cuts: Cut[], link: string) {
  if (!name || !cuts || !link) return { msg: 'Internal error'};

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) throw new Error('Internal error');

  const { error } = await db.from('loop').insert([
    {
      user_id: user.id,
      name: name,
      cuts: cuts,
      share_url: link,
    },
  ]);

  if (error) throw new Error('Error saving loop');

  return { msg: 'Loop saved' };
}
