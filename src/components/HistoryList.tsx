"use client";

import type { HistoryEntry } from "@/lib/types";
import { formatHistoryDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryListProps {
  entries: HistoryEntry[];
  onSelect: (id: string) => void;
  loadingId?: string | null;
}

export default function HistoryList({
  entries,
  onSelect,
  loadingId,
}: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted-foreground">
        No saved searches yet.
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-4">
        {entries.map((entry) => {
          const disabled = entry.fileMissing || loadingId === entry.id;

          return (
            <Card
              key={entry.id}
              size="sm"
              className={entry.fileMissing ? "opacity-60" : undefined}
            >
              <CardHeader className="pb-2">
                <CardTitle>{entry.query}</CardTitle>
                <CardDescription>
                  {formatHistoryDate(entry.createdAt)} · {entry.businessCount}{" "}
                  businesses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  limit {entry.limit} · zoom {entry.zoom}
                </p>
                {entry.fileMissing && (
                  <Badge variant="destructive">File missing</Badge>
                )}
                {loadingId === entry.id && (
                  <p className="text-xs text-muted-foreground">Loading...</p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => onSelect(entry.id)}
                >
                  Load search
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
