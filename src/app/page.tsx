"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { List } from "lucide-react";
import HelpDialog from "@/components/HelpDialog";
import SearchBar from "@/components/SearchBar";
import SettingsDialog from "@/components/SettingsDialog";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DEFAULT_CENTER,
  DEFAULT_SEARCH_SETTINGS,
  DEFAULT_ZOOM,
  STORAGE_KEYS,
  type SortOption,
} from "@/lib/constants";
import type {
  HistoryEntry,
  MapsBusiness,
  SearchResponse,
  SearchSettings,
} from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
      Loading map...
    </div>
  ),
});

function loadSearchSettings(): SearchSettings {
  if (typeof window === "undefined") return DEFAULT_SEARCH_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.searchSettings);
    if (!raw) return DEFAULT_SEARCH_SETTINGS;
    return { ...DEFAULT_SEARCH_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SEARCH_SETTINGS;
  }
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function HomePage() {
  const isClient = useIsClient();
  const [hasEnvKey, setHasEnvKey] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.apiKey)?.trim() ?? null;
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchSettings, setSearchSettings] = useState<SearchSettings>(
    loadSearchSettings,
  );

  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [query, setQuery] = useState("");
  const [businesses, setBusinesses] = useState<MapsBusiness[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<MapsBusiness | null>(
    null,
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"results" | "history">("results");
  const [sortBy, setSortBy] = useState<SortOption>("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [loadingHistoryId, setLoadingHistoryId] = useState<string | null>(null);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [initializingMap, setInitializingMap] = useState(true);
  const [recenterRequest, setRecenterRequest] = useState(0);

  const hasApiKey = hasEnvKey || Boolean(apiKey?.trim());

  const refreshHistory = useCallback(async () => {
    const response = await fetch("/api/searches");
    const data = (await response.json()) as { searches: HistoryEntry[] };
    setHistory(data.searches ?? []);
  }, []);

  useEffect(() => {
    async function bootstrap() {
      const configResponse = await fetch("/api/config");
      const config = (await configResponse.json()) as { hasEnvKey: boolean };
      setHasEnvKey(config.hasEnvKey);

      const storedKey = localStorage.getItem(STORAGE_KEYS.apiKey)?.trim();
      if (storedKey) setApiKey(storedKey);

      if (!config.hasEnvKey && !storedKey) {
        setSettingsOpen(true);
      }

      await refreshHistory();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setMapCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setRecenterRequest((value) => value + 1);
            setInitializingMap(false);
          },
          () => setInitializingMap(false),
        );
      } else {
        setInitializingMap(false);
      }
    }

    void bootstrap();
  }, [refreshHistory]);

  const handleSaveSettings = (
    nextSettings: SearchSettings,
    nextApiKey?: string,
  ) => {
    setSearchSettings(nextSettings);
    localStorage.setItem(
      STORAGE_KEYS.searchSettings,
      JSON.stringify(nextSettings),
    );

    if (!hasEnvKey && nextApiKey) {
      localStorage.setItem(STORAGE_KEYS.apiKey, nextApiKey);
      setApiKey(nextApiKey);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    if (!hasApiKey) {
      setSettingsOpen(true);
      setError("Add your ScrapeTable API key in Settings.");
      return;
    }

    setSearching(true);
    setError(null);
    setSelectedBusiness(null);

    const zoom = searchSettings.useMapZoom
      ? mapZoom
      : searchSettings.overrideZoom;

    const body = {
      query: query.trim(),
      lat: mapCenter.lat,
      lng: mapCenter.lng,
      zoom,
      limit: searchSettings.limit,
      lang: searchSettings.lang,
      country: searchSettings.country,
      ...(hasEnvKey ? {} : { apiKey }),
    };

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (!hasEnvKey && apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = (await response.json()) as SearchResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Search failed");
      }

      setBusinesses(data.data ?? []);
      setCreditsRemaining(data.creditsRemaining ?? null);
      setActiveTab("results");
      setMobilePanelOpen(true);
      await refreshHistory();
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Search failed. Try again.",
      );
      setBusinesses([]);
    } finally {
      setSearching(false);
    }
  };

  const handleLoadHistory = useCallback(async (id: string) => {
    setLoadingHistoryId(id);
    setError(null);

    try {
      const response = await fetch(`/api/searches/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not load saved search");
      }

      setBusinesses(data.response?.data ?? []);
      setQuery(data.params?.query ?? "");
      setMapCenter({ lat: data.params.lat, lng: data.params.lng });
      setMapZoom(data.params.zoom);
      setRecenterRequest((value) => value + 1);
      setSelectedBusiness(null);
      setActiveTab("results");
      setMobilePanelOpen(true);
    } catch (historyError) {
      setError(
        historyError instanceof Error
          ? historyError.message
          : "Could not load saved search",
      );
    } finally {
      setLoadingHistoryId(null);
    }
  }, []);

  const sidebar = (
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        businesses={businesses}
        history={history}
        selectedBusiness={selectedBusiness}
        onSelectBusiness={setSelectedBusiness}
        onLoadHistory={handleLoadHistory}
        loadingHistoryId={loadingHistoryId}
        sortBy={sortBy}
        onSortChange={setSortBy}
    />
  );

  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-muted/30">
      <div className="relative min-w-0 flex-1">
        {initializingMap && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-background/80 text-sm text-muted-foreground">
            Getting your location...
          </div>
        )}

        <MapView
          center={mapCenter}
          zoom={mapZoom}
          recenterRequest={recenterRequest}
          businesses={businesses}
          selectedBusiness={selectedBusiness}
          onMoveEnd={(center, zoom) => {
            setMapCenter(center);
            setMapZoom(zoom);
          }}
          onSelectBusiness={setSelectedBusiness}
          onClearSelection={() => setSelectedBusiness(null)}
        />

        <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMobilePanelOpen(true)}
            className="bg-background shadow-sm lg:hidden"
          >
            <List className="h-4 w-4" />
            Results ({businesses.length})
          </Button>
          <HelpDialog />
        </div>

        <div className="absolute bottom-6 left-1/2 z-[1000] w-[min(92%,560px)] -translate-x-1/2">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            onOpenSettings={() => setSettingsOpen(true)}
            searching={searching}
            canSearch={hasApiKey}
            error={error}
          />
        </div>
      </div>

      <aside className="relative z-0 hidden h-full w-96 shrink-0 border-l border-border bg-background lg:block">
        {sidebar}
      </aside>

      <Sheet open={mobilePanelOpen} onOpenChange={setMobilePanelOpen}>
        <SheetContent side="bottom" className="h-[85vh] gap-0 p-0 lg:hidden">
          <SheetHeader className="border-b border-border px-4 py-3">
            <SheetTitle>Results</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1">{sidebar}</div>
        </SheetContent>
      </Sheet>

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        hasEnvKey={hasEnvKey}
        settings={searchSettings}
        onSave={handleSaveSettings}
        creditsRemaining={creditsRemaining}
      />
    </div>
  );
}
