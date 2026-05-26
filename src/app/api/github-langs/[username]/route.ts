import { generateLanguagesSVG } from '@/lib/github-langs-svg';
import { fetchGitHubTopLanguages } from '@/lib/github-stats';
import type { GitHubCardTheme, GitHubCommonParams } from '@/types/github';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CACHE_MAX_AGE_OK = 43200;
const CACHE_S_MAXAGE_OK = 86400;
const CACHE_MAX_AGE_ERR = 300;
const CACHE_S_MAXAGE_ERR = 600;

const THEMES = [
  'dark',
  'light',
  'neon',
  'sunset',
  'ocean',
  'forest',
] as const satisfies readonly GitHubCardTheme[];

const THEME_BG: Record<string, [string, string]> = {
  dark: ['#0d1117', '#58a6ff'],
  light: ['#ffffff', '#0366d6'],
  neon: ['#0a0e27', '#00ff88'],
  sunset: ['#1a0b2e', '#ff6b35'],
  ocean: ['#0a1628', '#00d4ff'],
  forest: ['#0d2818', '#52b788'],
};

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

function renderErrorSvg(theme: string, title: string): string {
  const [bg0, bg1] = (THEME_BG[theme] ?? THEME_BG['dark'])!;
  return `<svg width="600" height="200" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="200" rx="12" fill="${bg0}"/><text x="300" y="95" text-anchor="middle" fill="${bg1}" font-family="'Segoe UI',Ubuntu,Arial,sans-serif" font-size="22" font-weight="700">${title}</text><text x="300" y="130" text-anchor="middle" fill="#8b949e" font-family="'Segoe UI',Ubuntu,Arial,sans-serif" font-size="14">Aguardando dados...</text></svg>`;
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
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE_OK}, s-maxage=${CACHE_S_MAXAGE_OK}`,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar SVG de linguagens:', error);
    const config = parseCommonParams(searchParams);
    const svg = renderErrorSvg(config.theme, 'GitHub Top Languages');
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE_ERR}, s-maxage=${CACHE_S_MAXAGE_ERR}`,
      },
    });
  }
}
