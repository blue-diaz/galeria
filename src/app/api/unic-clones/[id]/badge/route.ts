import { NextResponse } from 'next/server';
import {
  getClonesRedis,
  isClonesRedisConfigured,
  normalizeCloneId,
  unicCloneKey,
} from '@/lib/clones';
import { renderCloneBadgeSvg } from '@/lib/cloneBadgeSvg';

function normalizeHexColor(value: string | null): string | undefined {
  if (value === null) return undefined;
  const trimmed = value.trim();
  if (trimmed === '') return undefined;

  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  if (
    /^#[0-9a-fA-F]{3}$/.test(withHash) ||
    /^#[0-9a-fA-F]{6}$/.test(withHash)
  ) {
    return withHash;
  }
  return undefined;
}

function normalizeShape(
  value: string | null,
): 'rounded' | 'square' | 'pill' | undefined {
  if (value === null) return undefined;
  switch (value.trim().toLowerCase()) {
    case 'rounded':
      return 'rounded';
    case 'square':
      return 'square';
    case 'pill':
      return 'pill';
    default:
      return undefined;
  }
}

function normalizeLabel(value: string | null): string | undefined {
  if (value === null) return undefined;
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  const cleaned = trimmed
    .replace(/[^0-9A-Za-zÀ-ÿ .,_\-+:/]/g, '')
    .slice(0, 100);
  return cleaned === '' ? undefined : cleaned;
}

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const label = normalizeLabel(searchParams.get('label')) ?? 'unic clones';
  const labelBg = normalizeHexColor(searchParams.get('labelColor'));
  const valueBg = normalizeHexColor(searchParams.get('valueColor'));
  const textColor = normalizeHexColor(searchParams.get('textColor'));
  const shape = normalizeShape(searchParams.get('shape'));

  const styleOptions = {
    ...(labelBg !== undefined ? { labelBg } : {}),
    ...(valueBg !== undefined ? { valueBg } : {}),
    ...(textColor !== undefined ? { textColor } : {}),
    ...(shape !== undefined ? { shape } : {}),
  };

  try {
    const { id: rawId } = await params;
    const id = normalizeCloneId(rawId);
    if (id === null) {
      return new NextResponse('Invalid id', {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const incrementParam = searchParams.get('increment');
    const shouldIncrement =
      incrementParam === null ? true : incrementParam !== '0';

    if (!isClonesRedisConfigured()) {
      const svg = renderCloneBadgeSvg(label, 'n/a', styleOptions);
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Clones-Configured': '0',
        },
      });
    }

    const redis = getClonesRedis();
    const key = unicCloneKey(id);

    let count: number;
    if (shouldIncrement) {
      count = await redis.incr(key).catch((err) => {
        console.error('Unic clones badge incr error:', err);
        return 0;
      });
    } else {
      count =
        (await redis.get<number>(key).catch((err) => {
          console.error('Unic clones badge get error:', err);
          return null;
        })) ?? 0;
    }

    const svg = renderCloneBadgeSvg(label, String(count), styleOptions);
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Clones-Configured': '1',
      },
    });
  } catch (error) {
    console.error('Unic clones badge error:', error);
    const svg = renderCloneBadgeSvg(label, 'n/a', styleOptions);
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Clones-Configured': '0',
      },
    });
  }
}
