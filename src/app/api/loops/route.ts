import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Loop } from '@/app/lib/types';

type LoopsResponse = { data: Loop[] } | { error: string };

export async function GET(): Promise<NextResponse<LoopsResponse>> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await db
      .from('loop')
      .select('id, name, share_url, cuts, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Internal error loading loops.' }, { status: 500 });
    }

    return NextResponse.json({ data: (data ?? []) as Loop[] });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error occured.' }, { status: 500 });
  }
}
