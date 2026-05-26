'use client';

import type { ContentRendererProps } from '@/types/blog';
import { MDXRemote } from 'next-mdx-remote';
import Button from '../../components/ui/Button';

const components = {
  Button
};

export default function ContentRenderer({ content }: ContentRendererProps): React.ReactElement {
  return (
    <div className="prose prose-invert max-w-none">
      <MDXRemote {...content} components={components} />
    </div>
  );
}
