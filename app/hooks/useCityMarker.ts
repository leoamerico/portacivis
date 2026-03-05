'use client';

import {useEffect, useRef} from 'react';
import type {Map as LeafletMap, Marker} from 'leaflet';
import {FEDERATIVE_UNITS, NOMINATIM_SEARCH_URL} from '../../src/territory/constants';
import type {NominatimResult} from '../../src/territory/types';

// BRAND_COLOR_ALLOWLIST — hex values below are CSS variable fallbacks in inline SVG
const CITY_PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44" fill="none">
  <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 28 16 28s16-16 16-28C32 7.163 24.837 0 16 0z" fill="var(--color-brand-primary, #1D4ED8)"/>
  <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 28 16 28s16-16 16-28C32 7.163 24.837 0 16 0z" fill="none" stroke="var(--color-text-primary, #0F172A)" stroke-width="1.5"/>
  <circle cx="16" cy="16" r="7" fill="white"/>
</svg>`;

export function useCityMarker(
  city: string,
  selectedUf: string,
  mapRef: React.RefObject<LeafletMap | null>
): void {
  const cityMarkerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (!city.trim() || !selectedUf || !mapRef.current) {
      if (cityMarkerRef.current) {
        cityMarkerRef.current.remove();
        cityMarkerRef.current = null;
      }
      return;
    }

    const controller = new AbortController();

    const geocodeCity = async () => {
      try {
        const ufName = FEDERATIVE_UNITS.find((uf) => uf.code === selectedUf)?.name ?? selectedUf;
        const query = `${city.trim()}, ${ufName}, Brasil`;
        const url = `${NOMINATIM_SEARCH_URL}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=br`;

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {'Accept': 'application/json'}
        });

        if (!response.ok) return;

        const data = await response.json() as NominatimResult[];
        if (!data.length || !mapRef.current) return;

        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        const L = await import('leaflet');

        if (cityMarkerRef.current) {
          cityMarkerRef.current.remove();
          cityMarkerRef.current = null;
        }

        const pinIcon = L.divIcon({
          className: 'city-pin-marker',
          html: CITY_PIN_SVG,
          iconSize: [32, 44],
          iconAnchor: [16, 44],
          popupAnchor: [0, -44],
          tooltipAnchor: [0, -36]
        });

        const marker = L.marker([lat, lng], {icon: pinIcon})
          .addTo(mapRef.current)
          .bindTooltip(`${city.trim()} — ${selectedUf}`, {direction: 'top', offset: [0, -8]})
          .openTooltip();

        cityMarkerRef.current = marker;

        mapRef.current.setView([lat, lng], 7, {
          animate: true,
          duration: 0.8
        });
      } catch {
        // Geocoding failed silently — city pin won't appear but the app works normally
      }
    };

    void geocodeCity();

    return () => controller.abort();
  }, [city, selectedUf, mapRef]);
}
