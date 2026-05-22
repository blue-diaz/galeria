import { type NextRequest, NextResponse } from 'next/server';
import { getClonesRedis, normalizeCloneId, cloneKey } from '@/lib/clones';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id: rawId } = await params;
  try {
    const id = normalizeCloneId(rawId);
    if (id === null) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const incrementParam = searchParams.get('increment');
    const shouldIncrement =
      incrementParam === null ? true : incrementParam !== '0';

    const redis = getClonesRedis();
    const key = cloneKey(id);

    let count: number;
    if (shouldIncrement) {
      count = await redis.incr(key).catch((err) => {
        console.error('Clones counter incr error:', err);
        return 0;
      });
    } else {
      count =
        (await redis.get<number>(key).catch((err) => {
          console.error('Clones counter get error:', err);
          return null;
        })) ?? 0;
    }

    return NextResponse.json(
      {
        id,
        count,
        configured: true,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'X-Clones-Configured': '1',
        },
      },
    );
  } catch (error) {
    console.error('Clones counter error:', error);
    const id = normalizeCloneId(rawId) ?? rawId;
    return NextResponse.json(
      {
        id,
        count: 0,
        configured: false,
        error: 'Clones counter not configured',
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'X-Clones-Configured': '0',
        },
      },
    );
  }
}
