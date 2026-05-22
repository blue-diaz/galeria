/**
 * API route para linguagens do GitHub.
 * Gera SVGs com estatísticas de linguagens mais usadas por um usuário.
 */

import { generateLanguagesSVG } from '@/lib/github-langs-svg';
import { fetchGitHubTopLanguages } from '@/lib/github-stats';
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
  };
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
  const token =
    searchParams.get('token') ?? searchParams.get('github_token') ?? undefined;

  try {
    const languages = await fetchGitHubTopLanguages(
      username,
      token ?? undefined,
    );
    const config = parseCommonParams(searchParams);
    const displayName = getDisplayName(searchParams, username);

    const svg = generateLanguagesSVG(languages, displayName, config);

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Erro ao gerar SVG de linguagens:', error);
    return new NextResponse('Erro ao buscar linguagens do GitHub', {
      status: 500,
    });
  }
}
