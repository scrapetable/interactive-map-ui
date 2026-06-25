"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { MapsBusiness } from "@/lib/types";
import { formatAddress, formatRating, hasValidCoords } from "@/lib/format";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapViewProps {
  center: { lat: number; lng: number };
  zoom: number;
  recenterRequest?: number;
  businesses: MapsBusiness[];
  selectedBusiness: MapsBusiness | null;
  onMoveEnd: (center: { lat: number; lng: number }, zoom: number) => void;
  onSelectBusiness: (business: MapsBusiness) => void;
  onClearSelection: () => void;
}

function MapEvents({
  onMoveEnd,
}: {
  onMoveEnd: (center: { lat: number; lng: number }, zoom: number) => void;
}) {
  useMapEvents({
    moveend: (event) => {
      const map = event.target;
      const center = map.getCenter();
      onMoveEnd({ lat: center.lat, lng: center.lng }, map.getZoom());
    },
  });
  return null;
}

function RecenterMap({
  center,
  zoom,
  recenterRequest,
}: {
  center: { lat: number; lng: number };
  zoom: number;
  recenterRequest?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (recenterRequest == null || recenterRequest === 0) return;
    map.setView([center.lat, center.lng], zoom);
  }, [recenterRequest, center.lat, center.lng, zoom, map]);

  return null;
}
function FlyToSelected({ business }: { business: MapsBusiness | null }) {
  const map = useMap();

  useEffect(() => {
    if (!business || !hasValidCoords(business)) return;
    map.flyTo(
      { lat: Number(business.latitude), lng: Number(business.longitude) },
      Math.max(map.getZoom(), 15),
      { duration: 0.8 },
    );
  }, [business, map]);

  return null;
}

function BusinessPopupContent({ business }: { business: MapsBusiness }) {
  const address = formatAddress(business.address);
  const rating = formatRating(business.rating);

  return (
    <div className="min-w-[220px] max-w-xs text-sm">
      <h3 className="font-semibold text-zinc-900">
        {business.name ?? "Unnamed business"}
      </h3>
      {address && <p className="mt-1 text-zinc-600">{address}</p>}
      {(rating || business.reviewCount) && (
        <p className="mt-1 text-zinc-600">
          {rating && <span>{rating} stars</span>}
          {business.reviewCount != null && (
            <span>
              {rating ? " · " : ""}
              {business.reviewCount} reviews
            </span>
          )}
        </p>
      )}
      {business.placeLink && (
        <a
          href={business.placeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-blue-600 hover:underline"
        >
          Open in Maps
        </a>
      )}
    </div>
  );
}

export default function MapView({
  center,
  zoom,
  recenterRequest,
  businesses,
  selectedBusiness,
  onMoveEnd,
  onSelectBusiness,
  onClearSelection,
}: MapViewProps) {
  const selectedKey = useMemo(() => {
    if (!selectedBusiness) return null;
    return (
      selectedBusiness.businessId ??
      `${selectedBusiness.name}-${selectedBusiness.latitude}-${selectedBusiness.longitude}`
    );
  }, [selectedBusiness]);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMoveEnd={onMoveEnd} />
      <RecenterMap
        center={center}
        zoom={zoom}
        recenterRequest={recenterRequest}
      />
      <FlyToSelected business={selectedBusiness} />

      {businesses.map((business, index) => {
        if (!hasValidCoords(business)) return null;

        const key =
          business.businessId ??
          `${business.name}-${business.latitude}-${business.longitude}-${index}`;
        const businessKey =
          business.businessId ??
          `${business.name}-${business.latitude}-${business.longitude}`;
        const isSelected = selectedKey != null && selectedKey === businessKey;

        return (
          <Marker
            key={key}
            position={[Number(business.latitude), Number(business.longitude)]}
            icon={markerIcon}
            eventHandlers={{
              click: () => onSelectBusiness(business),
            }}
          >
            {isSelected && (
              <Popup eventHandlers={{ remove: onClearSelection }} autoPan>
                <BusinessPopupContent business={business} />
              </Popup>
            )}
          </Marker>
        );
      })}
    </MapContainer>
  );
}
