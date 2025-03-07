import React from 'react';
import { CopyButton } from './CopyButton';

interface PlainCodeBlockProps {
  code: string;
  className?: string;
}

export const PlainCodeBlock: React.FC<PlainCodeBlockProps> = ({ code, className = '' }) => {
  return (
    <div className={`relative bg-muted rounded-md overflow-hidden group ${className}`}>
      <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-primary-muted">
        <CopyButton text={code} />
      </div>
      <pre className="p-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <code className="text-sm text-muted-foreground">{code}</code>
      </pre>
    </div>
  );
}; 