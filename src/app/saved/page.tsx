import { db } from '@/app/lib/db';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Saved from '@/pages/Saved';

export default async function Page() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  
  if (!isUserAuthenticated) return { msg: 'Not logged in'}

  const user = await getUser();

  if (!user) return { msg: 'No user'}

  const { data: loops } = await db
    .from('loop')
    .select('id, name, share_url, cuts, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <Saved data={loops} />
}