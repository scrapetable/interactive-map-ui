"use client";

import type { IconType } from "react-icons";
import { FaLinkedin } from "react-icons/fa6";
import {
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiPinterest,
  SiSnapchat,
  SiTiktok,
  SiX,
  SiYoutube,
} from "react-icons/si";
import type { MapsBusiness } from "@/lib/types";
import { formatAddress, formatPhone, formatRating } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BusinessCardProps {
  business: MapsBusiness;
  selected?: boolean;
  onClick: () => void;
}

const SOCIAL_FIELDS: Array<{
  key: keyof MapsBusiness;
  label: string;
  Icon: IconType;
}> = [
  { key: "facebook", label: "Facebook", Icon: SiFacebook },
  { key: "instagram", label: "Instagram", Icon: SiInstagram },
  { key: "tiktok", label: "TikTok", Icon: SiTiktok },
  { key: "twitter", label: "Twitter / X", Icon: SiX },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin },
  { key: "youtube", label: "YouTube", Icon: SiYoutube },
  { key: "pinterest", label: "Pinterest", Icon: SiPinterest },
  { key: "snapchat", label: "Snapchat", Icon: SiSnapchat },
  { key: "github", label: "GitHub", Icon: SiGithub },
];

function stopPropagation(event: React.MouseEvent) {
  event.stopPropagation();
}

export default function BusinessCard({
  business,
  selected = false,
  onClick,
}: BusinessCardProps) {
  const address = formatAddress(business.address);
  const rating = formatRating(business.rating);

  const websiteHref = business.website ?? null;
  const websiteLabel = websiteHref
    ? websiteHref.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;

  const emails = business.emails ?? [];
  const phoneDisplay = business.phone ? formatPhone(business.phone) : null;
  const socials = SOCIAL_FIELDS.map((field) => ({
    label: field.label,
    Icon: field.Icon,
    href: business[field.key] as string | null | undefined,
  })).filter((item) => Boolean(item.href));

  return (
    <Card
      size="sm"
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted/50",
        selected && "border-primary bg-muted/50",
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle>{business.name ?? "Unnamed business"}</CardTitle>
        {address && <CardDescription>{address}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {(rating || business.reviewCount != null) && (
          <p className="text-xs text-muted-foreground">
            {rating && <span>{rating} stars</span>}
            {business.reviewCount != null && (
              <span>
                {rating ? " · " : ""}
                {business.reviewCount} reviews
              </span>
            )}
          </p>
        )}

        {websiteHref && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">Website</p>
            <a
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stopPropagation}
              className="break-all text-primary hover:underline"
            >
              {websiteLabel}
            </a>
          </div>
        )}

        {business.phone && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">Phone</p>
            <a
              href={`tel:${business.phone}`}
              onClick={stopPropagation}
              className="text-primary hover:underline"
            >
              {phoneDisplay}
            </a>
          </div>
        )}

        {emails.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">Emails</p>
            <div className="flex flex-col gap-0.5">
              {emails.map((email) => (
                <a
                  key={email.value}
                  href={`mailto:${email.value}`}
                  onClick={stopPropagation}
                  className="break-all text-primary hover:underline"
                >
                  {email.value}
                </a>
              ))}
            </div>
          </div>
        )}

        {socials.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">Social</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={stopPropagation}
                  title={social.label}
                  aria-label={social.label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <social.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
