export type CloneBadgeShape = 'rounded' | 'square' | 'pill';

export interface CloneBadgeStyleOptions {
  labelBg?: string;
  valueBg?: string;
  textColor?: string;
  rx?: number;
  shape?: CloneBadgeShape;
}

export interface CloneVariant {
  id: string;
  title: string;
  alt: string;
  labelForMarkdown: string;
  query: Record<string, string>;
  previewQuery?: Record<string, string>;
}
