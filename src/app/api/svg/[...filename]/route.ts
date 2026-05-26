import type { CacheEntry } from '@/types/svg';
import fs from 'fs';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { isValidDimension, manipulateSvgDimensions } from '../svgManipulator';

const svgCache = new Map<string, CacheEntry>();

function findSvgRoot(): string {
  const candidates = [
    path.join(process.cwd(), 'public', 'svg'),
    path.join(process.cwd(), '..', 'public', 'svg'),
    path.resolve('public', 'svg'),
  ];
  for (const dir of candidates) {
    try {
      if (fs.statSync(dir).isDirectory()) return dir;
    } catch {
      continue;
    }
  }
  return candidates[0] as string;
}

const SVG_ROOT = findSvgRoot();

const nameMap = new Map<string, string>();
function buildNameMap(): void {
  const walk = (dir: string): void => {
    let entries: string[];
    try {
      entries = fs.readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry);
      try {
        const st = fs.statSync(full);
        if (st.isDirectory()) {
          walk(full);
        } else if (st.isFile() && entry.toLowerCase().endsWith('.svg')) {
          nameMap.set(entry, full);
        }
      } catch {
        continue;
      }
    }
  };
  try {
    walk(SVG_ROOT);
  } catch {
    // Diretório não existe ou sem permissão
  }
}
buildNameMap();

function isSafeSvgRequestPath(filename: string): boolean {
  if (filename.trim() === '') return false;
  if (filename.includes('..')) return false;
  if (filename.startsWith('/') || filename.startsWith('\\')) return false;
  if (filename.includes('\\')) return false;
  if (path.isAbsolute(filename)) return false;
  if (!filename.toLowerCase().endsWith('.svg')) return false;
  if (!/^[a-zA-Z0-9._\-/]+$/.test(filename)) return false;
  return true;
}

function findSvgPath(filename: string): string | null {
  const direct = path.join(SVG_ROOT, filename);
  try {
    if (fs.statSync(direct).isFile()) return direct;
  } catch {
    // Arquivo não encontrado
  }
  return nameMap.get(path.basename(filename)) ?? null;
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

    const svgPath = findSvgPath(filename);
    if (svgPath === null)
      return new NextResponse('SVG not found', { status: 404 });

    const stat = fs.statSync(svgPath);
    const cached = svgCache.get(svgPath);
    const isFresh = cached?.mtimeMs === stat.mtimeMs;
    const baseContent = isFresh
      ? cached.content
      : fs.readFileSync(svgPath, 'utf-8');
    if (!isFresh) {
      svgCache.set(svgPath, { content: baseContent, mtimeMs: stat.mtimeMs });
    }

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
