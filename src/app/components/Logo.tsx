/**
 * Componente `Logo` — exibe a marca e texto padrão do projeto.
 */
import type { LogoProps } from '@/types/ui';
import Image from 'next/image';

// Texto padrão do logo da aplicação
const LOGO_TEXT = 'Black Diaz';

export default function Logo({
  size = 48,
  showText = true,
  className = '',
}: LogoProps): React.ReactElement {
  return (
    <div
      className={`inline-flex cursor-pointer items-center gap-3 transition-transform hover:scale-105 ${className}`}
    >
      <Image
        src="/icons/black-diaz.jpg"
        alt="Black Diaz Logo"
        width={size}
        height={size}
        className="shadowLogo rounded-lg object-cover"
        priority
      />
      {showText && (
        <span className="logoText text-xl font-normal tracking-wide text-[var(--text-primary)]">
          {LOGO_TEXT.split(' ').map((part, index) =>
            index === 1 ? <strong key={part}>{part}</strong> : part + ' ',
          )}
        </span>
      )}
    </div>
  );
}
