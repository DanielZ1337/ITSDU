import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import React, { forwardRef, useCallback } from "react";
import { Input, type InputProps } from "./input";

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className="relative block">
        <span className="sr-only">Search</span>
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </span>
        <Input className={cn("py-2 pl-9 pr-4", className)} ref={ref} {...props} />
      </label>
    );
  },
);

SearchInput.displayName = "Search";

const SearchContext = React.createContext<{
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearValue: () => void;
}>({
  value: "",
  handleChange: () => {},
  clearValue: () => {},
});

function useSearch() {
  if (!React.useContext(SearchContext)) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  return React.useContext(SearchContext);
}

function SearchProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = React.useState("");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const clearValue = useCallback(() => {
    setValue("");
  }, []);

  return (
    <SearchContext.Provider value={{ value, handleChange, clearValue }}>
      {children}
    </SearchContext.Provider>
  );
}

export { SearchInput, SearchProvider, useSearch };
