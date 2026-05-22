'use client';

import { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import CodeModal from '../../../components/ui/CodeModal';
import SVGGalleryNotification from '../../../components/ui/SVGGalleryNotification';
import type { VisitorVariant } from '@/types/visitor';

type BadgeVariant = VisitorVariant;

function toQueryString(params: Record<string, string> | undefined): string {
  if (params === undefined) return '';
  const sp = new URLSearchParams(params);
  const out = sp.toString();
  return out === '' ? '' : `?${out}`;
}

function getClientBaseUrl(): string {
  const origin =
    typeof window !== 'undefined' ? window.location?.origin : undefined;
  if (origin !== undefined && origin !== null && origin !== '') return origin;

  const envSiteUrl = process.env['NEXT_PUBLIC_SITE_URL'];
  if (envSiteUrl !== undefined && envSiteUrl !== null && envSiteUrl !== '') {
    return envSiteUrl.replace(/\/$/, '');
  }

  const envCanonicalUrl = process.env['NEXT_PUBLIC_CANONICAL_URL'];
  if (
    envCanonicalUrl !== undefined &&
    envCanonicalUrl !== null &&
    envCanonicalUrl !== ''
  ) {
    return envCanonicalUrl.replace(/\/$/, '');
  }

  return '';
}

function getBadgePath(id: string, cloneId: string, visitorId: string): string {
  if (id.startsWith('unic-clones')) {
    return `/api/clones/${cloneId}/unic/badge.svg`;
  }
  if (id.startsWith('clones-')) {
    return `/api/clones/${cloneId}/badge.svg`;
  }
  return `/api/visitors/${visitorId}/badge.svg`;
}

export default function VisitorsBadgeGrid(): React.ReactElement {
  const [notification, setNotification] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentCode, setCurrentCode] = useState<string>('');

  const showNotificationMessage = (message: string): void => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const cloneIdPlaceholder = 'seu-repo';
  const visitorIdPlaceholder = 'seu-usuario';

  const variants = useMemo<BadgeVariant[]>(
    () => [
      {
        id: 'visitors-neon',
        title: 'Visitors Neon',
        alt: 'Badge visitors cyberpunk neon cyan',
        labelForMarkdown: 'Visitors',
        query: {
          label: 'visitors',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: '00fff7',
          textColor: 'ffffff',
        },
        previewQuery: {
          label: 'visitors',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: '00fff7',
          textColor: 'ffffff',
          increment: '0',
        },
      },
      {
        id: 'visitors-cyber',
        title: 'Visitors Cyber',
        alt: 'Badge visitors cyberpunk neon pink',
        labelForMarkdown: 'Visitors',
        query: {
          label: 'visitors',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: 'ff00aa',
          textColor: 'ffffff',
        },
        previewQuery: {
          label: 'visitors',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: 'ff00aa',
          textColor: 'ffffff',
          increment: '0',
        },
      },
      {
        id: 'clones-neon',
        title: 'Clones Neon',
        alt: 'Badge clones cyberpunk neon green',
        labelForMarkdown: 'Clones',
        query: {
          label: 'clones',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: '00ff88',
          textColor: 'ffffff',
        },
        previewQuery: {
          label: 'clones',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: '00ff88',
          textColor: 'ffffff',
          increment: '0',
        },
      },
      {
        id: 'clones-cyber',
        title: 'Clones Cyber',
        alt: 'Badge clones cyberpunk neon orange',
        labelForMarkdown: 'Clones',
        query: {
          label: 'clones',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: 'ff6600',
          textColor: 'ffffff',
        },
        previewQuery: {
          label: 'clones',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: 'ff6600',
          textColor: 'ffffff',
          increment: '0',
        },
      },
      {
        id: 'unic-clones-neon',
        title: 'Unic Clones Neon',
        alt: 'Badge unic clones cyberpunk neon purple',
        labelForMarkdown: 'Unic Clones',
        query: {
          label: 'unic clones',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: 'aa00ff',
          textColor: 'ffffff',
        },
        previewQuery: {
          label: 'unic clones',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: 'aa00ff',
          textColor: 'ffffff',
          increment: '0',
        },
      },
      {
        id: 'unic-clones-cyber',
        title: 'Unic Clones Cyber',
        alt: 'Badge unic clones cyberpunk neon teal',
        labelForMarkdown: 'Unic Clones',
        query: {
          label: 'unic clones',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: '00ccbb',
          textColor: 'ffffff',
        },
        previewQuery: {
          label: 'unic clones',
          shape: 'square',
          labelColor: '0a0a0f',
          valueColor: '00ccbb',
          textColor: 'ffffff',
          increment: '0',
        },
      },
    ],
    [],
  );

  const generateMarkdownCode = (variant: BadgeVariant): string => {
    const baseUrl = getClientBaseUrl();
    const path = getBadgePath(
      variant.id,
      cloneIdPlaceholder,
      visitorIdPlaceholder,
    );
    const queryString = toQueryString(variant.query);
    const imageUrl = `${baseUrl}${path}${queryString}`;
    return `![${variant.labelForMarkdown}](${imageUrl})`;
  };

  const viewCode = (variant: BadgeVariant): void => {
    setCurrentCode(generateMarkdownCode(variant));
    setShowModal(true);
  };

  const copyCode = async (variant: BadgeVariant): Promise<void> => {
    try {
      const code = generateMarkdownCode(variant);
      await navigator.clipboard.writeText(code);
      showNotificationMessage('✓ Código copiado com sucesso!');
    } catch {
      showNotificationMessage(
        '✗ Não foi possível copiar (permissão do navegador).',
      );
    }
  };

  const copyModalCode = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(currentCode);
      showNotificationMessage('✓ Código copiado!');
    } catch {
      showNotificationMessage(
        '✗ Não foi possível copiar (permissão do navegador).',
      );
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-[var(--text-bright)]">
          <i className="fas fa-users mr-2" />
          Visitors
        </h1>
        <p className="text-[var(--text-muted)]">
          Badges cyberpunk neon de visitors e clones. Copie o código e troque{' '}
          <code>seu-usuario</code> pelo seu usuário ou <code>seu-repo</code>{' '}
          pelo seu repositório.
        </p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Observação: os previews usam <code>increment=0</code> para não inflar
          os contadores.
        </p>
      </div>

      <main className="galeriaGrid mx-auto grid w-full grid-cols-1 gap-5 px-4 pb-9">
        {variants.map((variant, index) => {
          const previewQuery = variant.previewQuery ?? variant.query;
          const previewQueryString = toQueryString(previewQuery);
          const previewSrc = `${getBadgePath(variant.id, cloneIdPlaceholder, visitorIdPlaceholder)}${previewQueryString}`;

          return (
            <Card
              key={variant.id}
              className="svgCard cardSvg animateFadeInUp"
              style={
                {
                  '--animation-delay': `${index * 0.1}s`,
                } as React.CSSProperties
              }
            >
              <div className="svgCardTitle text3xl mb-4 font-mono font-semibold text-[var(--text-bright)]">
                {variant.title}
              </div>

              <div className="bg-black maxH300 mb-3 overflow-hidden rounded-md border border-[var(--border-default)] p-5">
                <img className="h-9" src={previewSrc} alt={variant.alt} />
              </div>

              <div className="svgCardActions flex flex-wrap gap-2">
                <Button
                  className="svgCardButton iconSm font-mono"
                  variant="primary"
                  onClick={() => void copyCode(variant)}
                  type="button"
                >
                  <i className="fas fa-copy" /> Copiar Código
                </Button>

                <Button
                  className="svgCardButton iconSm font-mono"
                  variant="secondary"
                  onClick={() => viewCode(variant)}
                  type="button"
                >
                  <i className="fas fa-code" /> Ver Código
                </Button>
              </div>
            </Card>
          );
        })}
      </main>

      <CodeModal
        code={currentCode}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCopy={copyModalCode}
      />

      {notification !== '' && <SVGGalleryNotification message={notification} />}
    </>
  );
}
