import { type NextRequest, NextResponse } from 'next/server';
import { isValidDimension, manipulateSvgDimensions } from '../svgManipulator';

const svgContentCache = new Map<string, string>();

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

    const url = new URL(request.url);
    const staticUrl = `${url.origin}/svg/${filename}`;

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
