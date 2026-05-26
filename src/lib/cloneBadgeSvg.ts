/**
 * Renderizador de SVG de badge de clones.
 * Substitui placeholders do template base com valores fornecidos.
 */

import { CLONE_BADGE_SVG_BASE } from '@/lib/cloneBadgeBase';
import type { CloneBadgeShape, CloneBadgeStyleOptions } from '@/types/clone';

export type { CloneBadgeShape, CloneBadgeStyleOptions };

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function resolveRx(options: CloneBadgeStyleOptions | undefined): number {
  const defaultRx = 6;

  if (options?.rx !== undefined) {
    return clampInt(options.rx, 0, 14);
  }

  switch (options?.shape) {
    case 'square':
      return 0;
    case 'pill':
      return 14;
    case 'rounded':
    default:
      return defaultRx;
  }
}

/**
 * Renderiza o SVG completo do badge de clone com os valores fornecidos.
 * @param label - Texto do label (ex: "clones")
 * @param value - Valor numérico ou texto a exibir
 * @param options - Opções de estilo opcionais
 * @returns String SVG completa
 */
export function renderCloneBadgeSvg(
  label: string,
  value: string,
  options?: CloneBadgeStyleOptions,
): string {
  const safeLabel = escapeXml(label);
  const safeValue = escapeXml(value);

  const ariaLabel = `${safeLabel}: ${safeValue}`;

  const labelBg = options?.labelBg ?? '#0a0a0f';
  const valueBg = options?.valueBg ?? '#00ff88';
  const textColor = options?.textColor ?? '#fff';
  const rx = resolveRx(options);

  return CLONE_BADGE_SVG_BASE.replace('__ARIA_LABEL__', ariaLabel)
    .replace('__LABEL__', safeLabel)
    .replace('__VALUE__', safeValue)
    .replaceAll('__LABEL_BG__', labelBg)
    .replaceAll('__VALUE_BG__', valueBg)
    .replaceAll('__TEXT_COLOR__', textColor)
    .replaceAll('__RX__', String(rx));
}
