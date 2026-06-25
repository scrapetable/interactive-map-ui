"use client";

import type { HistoryEntry, MapsBusiness } from "@/lib/types";
import type { SortOption } from "@/lib/constants";
import { sortBusinesses } from "@/lib/format";
import BusinessCard from "@/components/BusinessCard";
import HistoryList from "@/components/HistoryList";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SidebarProps {
  activeTab: "results" | "history";
  onTabChange: (tab: "results" | "history") => void;
  businesses: MapsBusiness[];
  history: HistoryEntry[];
  selectedBusiness: MapsBusiness | null;
  onSelectBusiness: (business: MapsBusiness) => void;
  onLoadHistory: (id: string) => void;
  loadingHistoryId?: string | null;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  businesses,
  history,
  selectedBusiness,
  onSelectBusiness,
  onLoadHistory,
  loadingHistoryId,
  sortBy,
  onSortChange,
}: SidebarProps) {
  const sortedBusinesses = sortBusinesses(businesses, sortBy);
  const selectedKey =
    selectedBusiness?.businessId ??
    `${selectedBusiness?.name}-${selectedBusiness?.latitude}-${selectedBusiness?.longitude}`;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as "results" | "history")}
      className="flex h-full flex-col gap-0 bg-background"
    >
      <div className="border-b border-border p-3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="results">Results ({businesses.length})</TabsTrigger>
          <TabsTrigger value="history">History ({history.length})</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="results" className="mt-0 flex min-h-0 flex-1 flex-col">
        {businesses.length > 0 && (
          <div className="border-b border-border p-3">
            <Label className="text-xs text-muted-foreground">Sort by</Label>
            <Select
              value={sortBy || "none"}
              onValueChange={(value) =>
                onSortChange((value === "none" ? "" : value) as SortOption)
              }
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="rating-high">Rating: high to low</SelectItem>
                <SelectItem value="rating-low">Rating: low to high</SelectItem>
                <SelectItem value="reviews-high">Reviews: high to low</SelectItem>
                <SelectItem value="reviews-low">Reviews: low to high</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {sortedBusinesses.length > 0 ? (
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-2 p-4">
              {sortedBusinesses.map((business, index) => {
                const businessKey =
                  business.businessId ??
                  `${business.name}-${business.latitude}-${business.longitude}-${index}`;
                const isSelected =
                  selectedKey === business.businessId ||
                  selectedKey ===
                    `${business.name}-${business.latitude}-${business.longitude}`;

                return (
                  <BusinessCard
                    key={businessKey}
                    business={business}
                    selected={isSelected}
                    onClick={() => onSelectBusiness(business)}
                  />
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted-foreground">
            No results yet. Search this area to get started.
          </div>
        )}

      </TabsContent>

      <TabsContent value="history" className="mt-0 min-h-0 flex-1">
        <HistoryList
          entries={history}
          onSelect={onLoadHistory}
          loadingId={loadingHistoryId}
        />
      </TabsContent>
    </Tabs>
  );
}
