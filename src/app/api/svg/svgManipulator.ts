import type { FitMode } from '@/types/svg';

export function isValidDimension(input: string | null): {
  ok: boolean;
  isPercent: boolean;
} {
  if (input === null) return { ok: false, isPercent: false };
  if (/^\d+%$/.test(input)) return { ok: true, isPercent: true };
  if (/^\d+$/.test(input))
    return { ok: parseInt(input, 10) > 0, isPercent: false };
  return { ok: false, isPercent: false };
}

function normalizeDimension(input: string | null): string | null {
  if (input === null) return null;
  const info = isValidDimension(input);
  if (!info.ok) return null;
  if (/^\d+%?$/.test(input)) return input;
  return null;
}

function buildViewBox(
  viewBox: string | null,
  originalWidth: string,
  originalHeight: string,
): string {
  if (viewBox !== null) return viewBox;
  const parsedW = parseFloat(originalWidth.replace(/[^\d.]/g, ''));
  const parsedH = parseFloat(originalHeight.replace(/[^\d.]/g, ''));
  const origW = !Number.isNaN(parsedW) && parsedW !== 0 ? parsedW : 1000;
  const origH = !Number.isNaN(parsedH) && parsedH !== 0 ? parsedH : 1000;
  return `0 0 ${origW} ${origH}`;
}

function applyProportionalResize(
  viewBox: string,
  widthParam: string | null,
  heightParam: string | null,
  widthInfo: { isPercent: boolean },
  heightInfo: { isPercent: boolean },
  newWidth: string,
  newHeight: string,
): { width: string; height: string } {
  const vbValues = viewBox.split(/[\s,]+/).map(Number);
  if (vbValues.length !== 4) return { width: newWidth, height: newHeight };

  const [, , vbWRaw, vbHRaw] = vbValues;
  const hasVbW =
    vbWRaw !== undefined && Number.isFinite(vbWRaw) && vbWRaw !== 0;
  const hasVbH =
    vbHRaw !== undefined && Number.isFinite(vbHRaw) && vbHRaw !== 0;
  if (!hasVbW || !hasVbH) return { width: newWidth, height: newHeight };

  let resultW = newWidth;
  let resultH = newHeight;

  if (widthParam !== null && heightParam === null && !widthInfo.isPercent) {
    const widthValue = parseInt(widthParam, 10);
    if (Number.isFinite(widthValue) && widthValue > 0) {
      resultH = `${Math.round(widthValue * (vbHRaw / vbWRaw))}`;
    }
  }
  if (heightParam !== null && widthParam === null && !heightInfo.isPercent) {
    const heightValue = parseInt(heightParam, 10);
    if (Number.isFinite(heightValue) && heightValue > 0) {
      resultW = `${Math.round(heightValue * (vbWRaw / vbHRaw))}`;
    }
  }

  return { width: resultW, height: resultH };
}

function resolveAspectRatio(
  fitParam: string | null,
  preserveAspectRatio: string | null,
): string | null {
  if (fitParam === null) {
    return preserveAspectRatio ?? 'xMidYMid meet';
  }

  const normalizedFit: FitMode | null = ['fill', 'cover', 'contain'].includes(
    fitParam,
  )
    ? (fitParam as FitMode)
    : null;

  switch (normalizedFit) {
    case 'fill':
      return 'none';
    case 'cover':
      return 'xMidYMid slice';
    case 'contain':
      return 'xMidYMid meet';
    default:
      return preserveAspectRatio ?? 'xMidYMid meet';
  }
}

function replaceSvgAttributes(
  attributesStr: string,
  attrs: Array<[string, string]>,
): string {
  let result = attributesStr;
  for (const [name, value] of attrs) {
    const regex = new RegExp(`${name}=["'][^"']+["']`);
    if (regex.test(result)) {
      result = result.replace(regex, `${name}="${value}"`);
    } else {
      result += ` ${name}="${value}"`;
    }
  }
  return result.replace(/\s+/g, ' ');
}

export function manipulateSvgDimensions(
  svgContent: string,
  widthParam: string | null,
  heightParam: string | null,
  fitParam: string | null = null,
): string {
  const widthInfo = isValidDimension(widthParam);
  const heightInfo = isValidDimension(heightParam);

  if (widthParam !== null && !widthInfo.ok) return svgContent;
  if (heightParam !== null && !heightInfo.ok) return svgContent;

  const safeWidth = normalizeDimension(widthParam);
  const safeHeight = normalizeDimension(heightParam);

  const svgTagMatch = svgContent.match(/<svg([^>]*)>/);
  if (svgTagMatch === null) return svgContent;

  const [originalTag, attributesStr] = svgTagMatch;
  if (attributesStr === undefined) return svgContent;

  const getAttr = (name: string): string | null => {
    const match = attributesStr.match(new RegExp(`${name}=["']([^"']+)["']`));
    return match?.[1] ?? null;
  };

  const rawViewBox = getAttr('viewBox');
  const originalWidth = getAttr('width') ?? '100%';
  const originalHeight = getAttr('height') ?? '100%';
  const preserveAspectRatio = getAttr('preserveAspectRatio');

  const viewBox = buildViewBox(rawViewBox, originalWidth, originalHeight);

  let newWidth = safeWidth ?? originalWidth;
  let newHeight = safeHeight ?? originalHeight;

  const resized = applyProportionalResize(
    viewBox,
    widthParam,
    heightParam,
    widthInfo,
    heightInfo,
    newWidth,
    newHeight,
  );
  newWidth = resized.width;
  newHeight = resized.height;

  const newPreserveAspectRatio = resolveAspectRatio(
    fitParam,
    preserveAspectRatio,
  );

  const newAttributes = replaceSvgAttributes(attributesStr, [
    ['width', newWidth],
    ['height', newHeight],
    ['viewBox', viewBox],
    ...(newPreserveAspectRatio !== null
      ? [['preserveAspectRatio', newPreserveAspectRatio] as [string, string]]
      : []),
  ]);

  return svgContent.replace(originalTag, `<svg${newAttributes}>`);
}
