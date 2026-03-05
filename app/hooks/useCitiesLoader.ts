'use client';

import {useEffect, useRef, useState} from 'react';
import type {IbgeCity} from '../../src/territory/types';
import {IBGE_MUNICIPIOS_URL} from '../../src/territory/constants';
import {readSavedSelection} from '../../src/territory/persistence';

type UseCitiesLoaderReturn = {
  city: string;
  setCity: (city: string) => void;
  cityOptions: string[];
  loadingCities: boolean;
  cityFetchFailed: boolean;
  setAutoSelectCity: (cityName: string) => void;
  restoredCity: string | null;
};

export function useCitiesLoader(selectedUf: string): UseCitiesLoaderReturn {
  const [city, setCity] = useState<string>('');
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityFetchFailed, setCityFetchFailed] = useState(false);
  const [restoredCity, setRestoredCity] = useState<string | null>(null);
  const autoSelectCityRef = useRef<string | null>(null);

  // Restore city from localStorage on mount
  useEffect(() => {
    const saved = readSavedSelection();
    if (saved?.city) {
      autoSelectCityRef.current = saved.city;
      setRestoredCity(saved.city);
    }
  }, []);

  // Fetch cities from IBGE when UF changes
  useEffect(() => {
    if (!selectedUf) {
      setCityOptions([]);
      if (autoSelectCityRef.current === null) setCity('');
      setCityFetchFailed(false);
      return;
    }

    const controller = new AbortController();
    setLoadingCities(true);
    setCityFetchFailed(false);
    if (!autoSelectCityRef.current) setCity('');

    fetch(`${IBGE_MUNICIPIOS_URL}/${selectedUf}/municipios`, {
      signal: controller.signal,
      cache: 'no-store'
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('IBGE request failed');
        const data = (await response.json()) as IbgeCity[];
        const options = data.map((item) => item.nome);
        setCityOptions(options);
        if (autoSelectCityRef.current) {
          const target = autoSelectCityRef.current;
          autoSelectCityRef.current = null;
          const match = options.find(
            (name) => name.toLowerCase() === target.toLowerCase()
          );
          setCity(match ?? target);
        }
      })
      .catch(() => {
        setCityOptions([]);
        setCityFetchFailed(true);
        if (autoSelectCityRef.current) {
          setCity(autoSelectCityRef.current);
          autoSelectCityRef.current = null;
        }
      })
      .finally(() => setLoadingCities(false));

    return () => controller.abort();
  }, [selectedUf]);

  const setAutoSelectCity = (cityName: string) => {
    autoSelectCityRef.current = cityName;
  };

  return {city, setCity, cityOptions, loadingCities, cityFetchFailed, setAutoSelectCity, restoredCity};
}
