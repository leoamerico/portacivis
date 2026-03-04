'use client';

import React, {createContext, useContext} from 'react';
import type {BrandRuntime} from '../../src/brand/types';

const BrandContext = createContext<BrandRuntime | null>(null);

export function BrandProvider({brand, children}: {brand: BrandRuntime; children: React.ReactNode}) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand(): BrandRuntime {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within BrandProvider');
  }

  return context;
}
