'use server'

import { db } from '@/app/lib/db';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Cut } from '../lib/types';
import { revalidatePath } from 'next/cache'

export async function saveLoop(
  _prevState: { msg: string } | undefined,
  payload: { name: string; cuts: Cut[]; link: string }
) {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) return { msg: 'Not logged in' };

  const user = await getUser();
  if (!user) return { msg: 'No user' };

  const { name, cuts, link } = payload

  const { error } = await db.from('loop').insert([
    {
      user_id: user.id,
      name: name,
      cuts: cuts,
      share_url: link,
    },
  ]);

  if (error) return { msg: 'Error saving loop' };

  revalidatePath('/')

  return { msg: 'Loop saved' };
}
