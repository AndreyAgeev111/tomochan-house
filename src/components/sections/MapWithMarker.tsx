import React from "react";

interface MapProps {
  address: string;
  latitude: number;
  longitude: number;
  zoom?: number;
  mapUrl?: string;
}

export default function MapWithMarker({
  address,
  latitude,
  longitude,
  zoom = 18,
  mapUrl,
}: MapProps) {
  // Use provided mapUrl or fallback to Google Maps search
  const googleMapsUrl =
    mapUrl ||
    `https://www.google.com/maps/search/${encodeURIComponent(address)}/@${latitude},${longitude},${zoom}z`;

  // Create simple embed URL using coordinates
  const embedUrl = `https://maps.google.com?q=${latitude},${longitude}&z=${zoom}&output=embed`;

  return (
    <div className="space-y-4">
      <div className="bg-warm-100 rounded-xl overflow-hidden aspect-video shadow-soft border-2 border-warm-200">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={address}
        />
      </div>

      {/* Open in Maps Button */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full px-4 py-3 bg-gradient-to-r from-accent-DEFAULT to-accent-dark hover:opacity-90 text-warm-900 rounded-lg font-bold transition-all text-center"
      >
        🗺️ Google Mapsで詳細を見る
      </a>
    </div>
  );
}
