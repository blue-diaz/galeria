import type { PanelProps } from '@/types/ui';
import React from 'react';

export default function Panel({
  children,
  as = 'div',
  className = '',
  ...props
}: PanelProps): React.ReactElement {
  const Tag: React.ElementType = as;
  const base =
    'rounded border border-[var(--vscode-border)] bg-[var(--vscode-bg)] p-4';
  return (
    <Tag {...props} className={`${base} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
