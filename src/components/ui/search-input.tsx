import React, { useEffect, useState } from 'react';
import { cn } from "../../lib/utils";
import { Search } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, debounceMs = 300, className, ...props }, ref) => {
    const [value, setValue] = useState(props.value || '');

    useEffect(() => {
      const timer = setTimeout(() => {
        onSearch(value as string);
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [value, debounceMs, onSearch]);

    return (
      <div className="relative w-full flex-1">
        <input
          {...props}
          ref={ref}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            props.onChange?.(e);
          }}
          className={cn(
            "w-full px-4 py-2.5 pl-10 text-sm sm:text-base border border-border rounded-lg",
            "focus:outline-none focus:ring-1 focus:ring-ring/40 focus:shadow-md focus:shadow-ring/20",
            "dark:bg-background dark:text-foreground",
            className
          )}
        />
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" 
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput"; 