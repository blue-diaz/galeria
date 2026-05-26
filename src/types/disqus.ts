declare global {
  interface Window {
    DISQUS?: {
      reset: (config: { reload: boolean; config?: () => void }) => void;
    };
  }
}

export interface DisqusCommentsProps {
  identifier: string;
  title: string;
  url: string;
}
