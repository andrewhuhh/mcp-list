import React from 'react';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const getLanguageDisplay = (language: string) => {
  if (!language) return 'Plain Text';
  
  // Map of common language identifiers to display names
  const languageMap: { [key: string]: string } = {
    'js': 'JavaScript',
    'jsx': 'JavaScript (JSX)',
    'ts': 'TypeScript',
    'tsx': 'TypeScript (JSX)',
    'py': 'Python',
    'python': 'Python',
    'rb': 'Ruby',
    'go': 'Go',
    'rust': 'Rust',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'cs': 'C#',
    'php': 'PHP',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sql': 'SQL',
    'sh': 'Shell',
    'bash': 'Bash',
    'powershell': 'PowerShell',
    'yaml': 'YAML',
    'json': 'JSON',
    'md': 'Markdown',
    'typescript': 'TypeScript',
    'javascript': 'JavaScript'
  };

  return languageMap[language.toLowerCase()] || language.charAt(0).toUpperCase() + language.slice(1);
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = '', className = '' }) => {
  return (
    <div className={`relative bg-muted rounded-md overflow-hidden ${className}`}>
      {/* Language header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary/5 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground">
          {getLanguageDisplay(language)}
        </span>
        <CopyButton text={code} />
      </div>
      
      {/* Code content */}
      <pre className="p-4 overflow-x-auto">
        <code className={`text-sm language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}; 