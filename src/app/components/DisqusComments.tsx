'use client';

import { useEffect, useRef } from 'react';
import type { DisqusCommentsProps } from '@/types/disqus';

const shortname = process.env['NEXT_PUBLIC_DISQUS_SHORTNAME'];

export default function DisqusComments({
  identifier,
  title,
  url
}: DisqusCommentsProps): React.ReactElement | null {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (shortname === undefined || shortname === '') return;

    if (isLoaded.current) {
      window.DISQUS?.reset({
        reload: true,
        config: () => {
          interface DisqusConfig {
            page: { identifier: string; title: string; url: string };
          }
          (window as unknown as Record<string, unknown>)['disqus_config'] = function (
            this: DisqusConfig
          ): void {
            this.page.identifier = identifier;
            this.page.title = title;
            this.page.url = url;
          };
        }
      });
      return;
    }

    isLoaded.current = true;

    const script = document.createElement('script');
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.setAttribute('data-timestamp', String(Date.now()));
    script.async = true;
    document.body.appendChild(script);
  }, [identifier, title, url]);

  if (shortname === undefined || shortname === '') {
    return null;
  }

  return (
    <div className="border-t-2 border-[var(--vscode-border)] pt-6">
      <div id="disqus_thread" ref={containerRef} />
      <noscript>
        Por favor, ative o JavaScript para ver os{' '}
        <a href={`https://${shortname}.disqus.com/?ref_noscript`}>comentários do Disqus</a>.
      </noscript>
    </div>
  );
}
