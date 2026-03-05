export type FederativeUnit = {
  code: string;
  name: string;
  lat: number;
  lng: number;
};

export type IbgeCity = {
  id: number;
  nome: string;
};

export type ProspectionLayer = {
  id: string;
  label: string;
  description: string;
  source: string;
};

export type SavedSelection = {
  uf?: string;
  city?: string;
  layers?: string[];
};

export type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};
