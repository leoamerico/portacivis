'use client';

import {useEffect, useRef} from 'react';
import type {CircleMarker, Map as LeafletMap} from 'leaflet';
import {
  FEDERATIVE_UNITS,
  MAP_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_MIN_ZOOM,
  MAP_MAX_ZOOM,
  MAP_TILE_URL,
  MAP_ATTRIBUTION,
  MARKER_BORDER_COLOR,
  MARKER_FILL_COLOR
} from '../../src/territory/constants';

type UseTerritoryMapReturn = {
  mapContainerRef: React.RefObject<HTMLDivElement>;
  mapRef: React.RefObject<LeafletMap | null>;
  markersRef: React.RefObject<Record<string, CircleMarker>>;
};

export function useTerritoryMap(
  selectedUf: string,
  onUfClick: (code: string) => void
): UseTerritoryMapReturn {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, CircleMarker>>({});

  // Initialize map
  useEffect(() => {
    let disposed = false;

    const setupMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;

      const L = await import('leaflet');
      if (disposed || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: MAP_CENTER,
        zoom: MAP_DEFAULT_ZOOM,
        minZoom: MAP_MIN_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
        zoomControl: true
      });

      L.tileLayer(MAP_TILE_URL, {
        attribution: MAP_ATTRIBUTION,
        maxNativeZoom: 19
      }).addTo(map);

      for (const uf of FEDERATIVE_UNITS) {
        const marker = L.circleMarker([uf.lat, uf.lng], {
          radius: 6,
          color: MARKER_BORDER_COLOR,
          weight: 1,
          fillColor: MARKER_FILL_COLOR,
          fillOpacity: 0.9
        })
          .addTo(map)
          .bindTooltip(`${uf.name} (${uf.code})`, {direction: 'top'});

        marker.on('click', () => onUfClick(uf.code));
        markersRef.current[uf.code] = marker;
      }

      mapRef.current = map;
    };

    void setupMap();

    return () => {
      disposed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = {};
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update marker styles and fly to selected UF
  useEffect(() => {
    for (const uf of FEDERATIVE_UNITS) {
      const marker = markersRef.current[uf.code];
      if (!marker) continue;

      marker.setStyle(
        uf.code === selectedUf
          ? {radius: 8, fillColor: MARKER_BORDER_COLOR, color: MARKER_BORDER_COLOR}
          : {radius: 6, fillColor: MARKER_FILL_COLOR, color: MARKER_BORDER_COLOR}
      );
    }

    const selected = FEDERATIVE_UNITS.find((uf) => uf.code === selectedUf);
    if (selected && mapRef.current) {
      mapRef.current.setView([selected.lat, selected.lng], 5, {
        animate: true,
        duration: 0.6
      });
    }
  }, [selectedUf]);

  return {mapContainerRef, mapRef, markersRef};
}
