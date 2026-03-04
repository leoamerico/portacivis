'use client';

import React, {createContext} from 'react';
import type {BrandRuntime} from '../../src/brand/types';

const BrandContext = createContext<BrandRuntime | null>(null);

export function BrandProvider({brand, children}: {brand: BrandRuntime; children: React.ReactNode}) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}
