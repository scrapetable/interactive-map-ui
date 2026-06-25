"use client";

import { ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SCRAPETABLE_LINKS } from "@/lib/scrapetable-links";

export default function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="bg-background shadow-sm"
          />
        }
      >
        <HelpCircle className="h-4 w-4" />
        Help
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How Interactive Map Search Works</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="mb-2 font-semibold text-foreground">
              1. Search for businesses
            </h4>
            <p>
              Pan and zoom the map to your area, then enter a query (like
              &quot;restaurants&quot; or &quot;coffee shops&quot;) in the search
              bar. Search uses your current map center.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">
              2. Browse results
            </h4>
            <p>
              Businesses appear as markers on the map and in the Results sidebar.
              Click a card or marker for details. Sort by rating or reviews.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">
              3. View history
            </h4>
            <p>
              Every search is saved locally in the History tab. Reload past
              searches from disk without spending more API credits.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">
              4. Configure settings
            </h4>
            <p>
              Open Settings to add your ScrapeTable API key, adjust result limit,
              zoom, language, and country. Each business returned costs 1 credit.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs">
            <p>
              <strong className="text-foreground">Tip:</strong> Pan and zoom the
              map before searching — results are based on the area you are
              viewing.
            </p>
          </div>
          <a
            href={SCRAPETABLE_LINKS.apiDocs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            ScrapeTable API docs
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
