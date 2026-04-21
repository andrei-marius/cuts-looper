import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Loop } from '@/app/lib/types';

type LoopsResponse =
  | { data: Loop[]; total: number; pageCount: number }
  | { error: string };

export async function GET(request: Request): Promise<NextResponse<LoopsResponse>> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '5');
    const offset = (page - 1) * limit;

    const { count } = await db
      .from('loop')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const total = count ?? 0;
    const pageCount = Math.ceil(total / limit);

    const { data, error } = await db
      .from('loop')
      .select('id, name, share_url, cuts, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: 'Internal error loading loops.' }, { status: 500 });
    }

    return NextResponse.json({ data: (data ?? []) as Loop[], total, pageCount });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error occured.' }, { status: 500 });
  }
}
