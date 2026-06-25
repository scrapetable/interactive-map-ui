"use client";

import { Search, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onOpenSettings: () => void;
  searching: boolean;
  canSearch: boolean;
  error?: string | null;
}

export default function SearchBar({
  query,
  onQueryChange,
  onSearch,
  onOpenSettings,
  searching,
  canSearch,
  error,
}: SearchBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-2 shadow-lg">
        <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          aria-label="Search query"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSearch();
          }}
          placeholder="Search this area, e.g. restaurants, coffee shops"
          className="h-9 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          aria-label="Open settings"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
        <Button
          type="button"
          onClick={onSearch}
          disabled={!canSearch || searching || !query.trim()}
          className="rounded-full px-4"
        >
          {searching ? "Searching..." : "Search"}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive" className="mt-2 shadow-sm">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
