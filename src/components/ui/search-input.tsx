import React, { useEffect, useState } from 'react';
import { cn } from "../../lib/utils";
import { Search, X } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, debounceMs = 300, className, value: propValue, ...props }, ref) => {
    const [value, setValue] = useState(propValue || '');

    // Update internal value when prop value changes
    useEffect(() => {
      if (propValue !== undefined && propValue !== value) {
        setValue(propValue);
      }
    }, [propValue]);

    useEffect(() => {
      const timer = setTimeout(() => {
        onSearch(value as string);
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [value, debounceMs, onSearch]);

    const handleClear = () => {
      setValue('');
      onSearch('');
    };

    return (
      <div className="relative w-full flex-1">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" 
        />
        <input
          {...props}
          ref={ref}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            props.onChange?.(e);
          }}
          className={cn(
            "w-full px-4 py-2.5 pl-10 pr-10 text-base rounded-xl outline-none",
            "focus:outline-none focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)] transition-all duration-300",
            "dark:bg-background dark:text-foreground",
            className
          )}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput"; 