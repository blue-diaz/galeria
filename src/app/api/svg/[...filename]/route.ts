import { type NextRequest, NextResponse } from 'next/server';
import { isValidDimension, manipulateSvgDimensions } from '../svgManipulator';

const svgContentCache = new Map<string, string>();

const configuredBaseOrigin =
  process.env['NEXT_PUBLIC_APP_URL'] ?? process.env['APP_URL'];

if (!configuredBaseOrigin) {
  throw new Error(
    'Missing APP_URL (or NEXT_PUBLIC_APP_URL) for trusted SVG fetch origin',
  );
}

const parsedBaseOrigin = new URL(configuredBaseOrigin);
if (
  (parsedBaseOrigin.protocol !== 'http:' &&
    parsedBaseOrigin.protocol !== 'https:') ||
  parsedBaseOrigin.pathname !== '/' ||
  parsedBaseOrigin.search !== '' ||
  parsedBaseOrigin.hash !== ''
) {
  throw new Error('APP_URL/NEXT_PUBLIC_APP_URL must be a valid origin URL');
}

const SVG_FETCH_BASE_ORIGIN = parsedBaseOrigin.origin;

function isSafeSvgRequestPath(filename: string): boolean {
  if (filename.trim() === '') return false;
  if (filename.includes('..')) return false;
  if (filename.startsWith('/') || filename.startsWith('\\')) return false;
  if (filename.includes('\\')) return false;
  if (!filename.toLowerCase().endsWith('.svg')) return false;
  if (!/^[a-zA-Z0-9._\-/]+$/.test(filename)) return false;
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string | string[] }> },
): Promise<NextResponse> {
  try {
    const { filename: raw } = await params;
    const filename = Array.isArray(raw) ? raw.join('/') : raw;

    if (!isSafeSvgRequestPath(filename)) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const widthParam = searchParams.get('width') ?? searchParams.get('w');
    const heightParam = searchParams.get('height') ?? searchParams.get('h');
    const fitParam = searchParams.get('fit');

    const widthInfo = isValidDimension(widthParam);
    const heightInfo = isValidDimension(heightParam);
    if (widthParam !== null && widthInfo.ok === false)
      return new NextResponse('Invalid width parameter', { status: 400 });
    if (heightParam !== null && heightInfo.ok === false)
      return new NextResponse('Invalid height parameter', { status: 400 });

    const cacheKey = `svg:${filename}`;
    const cached = svgContentCache.get(cacheKey);
    if (cached !== undefined) {
      let svgContent = cached;
      svgContent = manipulateSvgDimensions(
        svgContent,
        widthParam,
        heightParam,
        fitParam,
      );
      return new NextResponse(svgContent, {
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const staticUrl = new URL(
      `/svg/${filename}`,
      SVG_FETCH_BASE_ORIGIN,
    ).toString();

    const response = await fetch(staticUrl);
    if (!response.ok) {
      return new NextResponse('SVG not found', { status: 404 });
    }

    const baseContent = await response.text();
    svgContentCache.set(cacheKey, baseContent);

    let svgContent = baseContent;
    svgContent = manipulateSvgDimensions(
      svgContent,
      widthParam,
      heightParam,
      fitParam,
    );
    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving SVG:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
