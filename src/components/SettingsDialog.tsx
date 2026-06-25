"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  STORAGE_KEYS,
} from "@/lib/constants";
import { SCRAPETABLE_LINKS } from "@/lib/scrapetable-links";
import type { SearchSettings } from "@/lib/types";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  hasEnvKey: boolean;
  settings: SearchSettings;
  onSave: (settings: SearchSettings, apiKey?: string) => void;
  creditsRemaining?: number | null;
}

export default function SettingsDialog({
  open,
  onClose,
  hasEnvKey,
  settings,
  onSave,
  creditsRemaining,
}: SettingsDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search settings</DialogTitle>
          <DialogDescription>
            Configure search parameters and your API key.
          </DialogDescription>
        </DialogHeader>

        <SettingsForm
          key={open ? "open" : "closed"}
          hasEnvKey={hasEnvKey}
          initialSettings={settings}
          creditsRemaining={creditsRemaining}
          onSave={(nextSettings, apiKey) => {
            onSave(nextSettings, apiKey);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function SettingsForm({
  hasEnvKey,
  initialSettings,
  creditsRemaining,
  onSave,
}: {
  hasEnvKey: boolean;
  initialSettings: SearchSettings;
  creditsRemaining?: number | null;
  onSave: (settings: SearchSettings, apiKey?: string) => void;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === "undefined" || hasEnvKey) return "";
    return localStorage.getItem(STORAGE_KEYS.apiKey) ?? "";
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(settings, hasEnvKey ? undefined : apiKey.trim() || undefined);
      }}
    >
      {!hasEnvKey && (
        <div className="space-y-2">
          <Label htmlFor="api-key">API key</Label>
          <div className="flex gap-2">
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="scr_..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                window.open(
                  SCRAPETABLE_LINKS.apiDocs,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              Get API key
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Saved in this browser when you save settings.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="limit">Max results</Label>
        <Input
          id="limit"
          type="number"
          min={1}
          max={500}
          value={settings.limit}
          onChange={(event) =>
            setSettings((current) => ({
              ...current,
              limit: Number(event.target.value),
            }))
          }
        />
        <p className="text-xs text-muted-foreground">
          Up to {settings.limit} credits per search (1 per business found).
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="use-map-zoom"
          checked={settings.useMapZoom}
          onCheckedChange={(checked) =>
            setSettings((current) => ({
              ...current,
              useMapZoom: checked === true,
            }))
          }
        />
        <Label htmlFor="use-map-zoom">Use current map zoom</Label>
      </div>

      {!settings.useMapZoom && (
        <div className="space-y-2">
          <Label htmlFor="zoom">Zoom level</Label>
          <Input
            id="zoom"
            type="number"
            min={1}
            max={20}
            value={settings.overrideZoom}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                overrideZoom: Number(event.target.value),
              }))
            }
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Language</Label>
        <Select
          value={settings.lang}
          onValueChange={(value) =>
            setSettings((current) => ({ ...current, lang: value ?? current.lang }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Country</Label>
        <Select
          value={settings.country}
          onValueChange={(value) =>
            setSettings((current) => ({
              ...current,
              country: value ?? current.country,
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {creditsRemaining != null && (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          Credits remaining: {creditsRemaining.toLocaleString()}
        </p>
      )}

      <DialogFooter>
        <Button type="submit" className="w-full sm:w-auto">
          Save settings
        </Button>
      </DialogFooter>
    </form>
  );
}
