import type { MapsBusiness } from "@/lib/types";

export function formatAddress(address?: MapsBusiness["address"]): string | null {
  if (!address) return null;
  const parts = [
    address.street,
    address.city,
    address.region,
    address.postalCode,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

export function formatPhone(phone?: string | null): string | null {
  if (!phone) return null;
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");

  // US/Canada: +1 (xxx) xxx-xxxx
  if (digits.length === 11 && digits.startsWith("1")) {
    const d = digits.slice(1);
    return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return trimmed;
}

export function formatRating(rating?: number | string): string | null {
  if (rating === undefined || rating === null || rating === "") return null;
  const num = typeof rating === "string" ? parseFloat(rating) : rating;
  if (Number.isNaN(num)) return null;
  return num.toFixed(1);
}

export function hasValidCoords(business: MapsBusiness): boolean {
  const lat = Number(business.latitude);
  const lng = Number(business.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng);
}

export function sortBusinesses<T extends MapsBusiness>(
  businesses: T[],
  sortBy: string,
): T[] {
  const list = [...businesses];

  if (sortBy === "reviews-high") {
    list.sort((a, b) => Number(b.reviewCount ?? 0) - Number(a.reviewCount ?? 0));
  } else if (sortBy === "reviews-low") {
    list.sort((a, b) => Number(a.reviewCount ?? 0) - Number(b.reviewCount ?? 0));
  } else if (sortBy === "rating-high") {
    list.sort(
      (a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0),
    );
  } else if (sortBy === "rating-low") {
    list.sort(
      (a, b) => Number(a.rating ?? 0) - Number(b.rating ?? 0),
    );
  }

  return list;
}

export function formatHistoryDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
