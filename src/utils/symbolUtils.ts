// src/utils/symbolUtils.ts
import ms from 'milsymbol';

export interface MilitarySymbolOptions {
  sidc: string;          // 15-character SIDC (e.g., "SNGPUUM----AAA")
  size?: number;          // Icon pixel size (default: 32)
  uniqueDesignation?: string;
  higherFormation?: string;
  speed?: string;
}

export interface SymbolResult {
  dataUrl: string;
  pixelOffset: { x: number; y: number };
}

/**
 * Generates an SVG Data URL from a MIL-STD-2525 SIDC string and calculates
 * its exact center anchor offset to align symbol center with selection boxes.
 */
export function createSymbolResource(options: MilitarySymbolOptions): SymbolResult {
  const symbolOptions: Record<string, any> = {
    size: options.size || 32,
    square: true, // Ensures a symmetric canvas
  };

  if (options.uniqueDesignation) {
    symbolOptions.uniqueDesignation = String(options.uniqueDesignation);
  }
  if (options.higherFormation) {
    symbolOptions.higherFormation = String(options.higherFormation);
  }
  if (options.speed) {
    symbolOptions.speed = String(options.speed);
  }

  const symbol = new ms.Symbol(options.sidc, symbolOptions);

  // Get symbol anchor point and canvas size from milsymbol
  const anchor = symbol.getAnchor();
  const size = symbol.getSize();

  // Offset needed to position the true symbol origin directly over the Cesium coordinate
  const offsetX = size.width / 2 - anchor.x;
  const offsetY = size.height / 2 - anchor.y;

  return {
    dataUrl: symbol.toDataURL(),
    pixelOffset: { x: offsetX, y: offsetY },
  };
}

// Retain legacy export if referenced elsewhere
export function createSymbolDataUrl(options: MilitarySymbolOptions): string {
  return createSymbolResource(options).dataUrl;
}