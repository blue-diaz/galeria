/**
 * API route para estatísticas do GitHub.
 * Gera SVGs com estatísticas de perfil de um usuário do GitHub.
 */

import { fetchGitHubStats } from '@/lib/github-stats';
import { generateGitHubStatsSVG } from '@/lib/github-stats-svg';
import type { GitHubCardTheme, GitHubCommonParams } from '@/types/github';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const THEMES = [
  'dark',
  'light',
  'neon',
  'sunset',
  'ocean',
  'forest',
] as const satisfies readonly GitHubCardTheme[];

function parseTheme(value: string | null | undefined): GitHubCardTheme {
  if (value === null || value === undefined) return 'dark';
  const normalized = value.trim().toLowerCase();
  return (THEMES as readonly string[]).includes(normalized)
    ? (normalized as GitHubCardTheme)
    : 'dark';
}

function parseCommonParams(searchParams: URLSearchParams): GitHubCommonParams {
  const theme = parseTheme(searchParams.get('theme'));
  const borderRadius =
    searchParams.get('border_radius') ?? searchParams.get('borderRadius');
  const showBorder =
    searchParams.get('show_border') ?? searchParams.get('showBorder');
  const borderWidth =
    searchParams.get('border_width') ?? searchParams.get('borderWidth');
  const widthParam = searchParams.get('width') ?? searchParams.get('w');
  const heightParam = searchParams.get('height') ?? searchParams.get('h');

  return {
    theme,
    ...(borderRadius !== null && { borderRadius: parseInt(borderRadius) }),
    ...(showBorder !== null && { showBorder: showBorder === 'true' }),
    ...(borderWidth !== null && { borderWidth: parseInt(borderWidth) }),
    ...(widthParam !== null &&
      !Number.isNaN(Number(widthParam)) && { width: Number(widthParam) }),
    ...(heightParam !== null &&
      !Number.isNaN(Number(heightParam)) && { height: Number(heightParam) }),
  } as const;
}

function getDisplayName(
  searchParams: URLSearchParams,
  defaultUsername: string,
): string {
  const name = searchParams.get('name');
  if (name !== null && name.trim() !== '') {
    return name.trim();
  }
  return `@${defaultUsername}`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
): Promise<Response> {
  const { username } = await params;
  const { searchParams } = new URL(request.url);

  try {
    const stats = await fetchGitHubStats(username);
    const config = parseCommonParams(searchParams);
    const displayName = getDisplayName(searchParams, username);

    const svg = generateGitHubStatsSVG(stats, displayName, {
      ...config,
      theme: config.theme,
    });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Erro ao gerar SVG:', error);
    return new NextResponse('Erro ao buscar dados do GitHub', { status: 500 });
  }
}
