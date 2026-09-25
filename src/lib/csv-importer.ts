/**
 * Civitas — CSV Parser & Unit Importer Utility
 *
 * Parses CSV files for bulk estate unit onboarding with schema validation,
 * error reporting, and sample template generation.
 */

export interface ParsedUnitRow {
  rowIndex: number;
  unit_number: string;
  block_phase?: string;
  property_type: 'residential' | 'commercial' | 'mixed_use' | 'industrial';
  bedrooms?: number;
  bathrooms?: number;
  monthly_rent?: number;
  handover_date?: string;
  buyer_name?: string;
  buyer_phone?: string;
  buyer_email?: string;
  isValid: boolean;
  errors: string[];
}

export interface CsvParseResult {
  rows: ParsedUnitRow[];
  validCount: number;
  invalidCount: number;
  headers: string[];
}

export function parseUnitsCsv(csvText: string): CsvParseResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { rows: [], validCount: 0, invalidCount: 0, headers: [] };
  }

  // Parse header line
  const rawHeaders = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
  const dataLines = lines.slice(1);

  const rows: ParsedUnitRow[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const rawCols = dataLines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    const rowMap: Record<string, string> = {};

    rawHeaders.forEach((h, idx) => {
      rowMap[h] = rawCols[idx] || '';
    });

    const errors: string[] = [];

    // Unit number validation
    const unitNumber = rowMap['unit_number'] || rowMap['unit'] || rowMap['apartment'] || '';
    if (!unitNumber) {
      errors.push('Unit Number is required');
    }

    // Property type validation
    let propType: ParsedUnitRow['property_type'] = 'residential';
    const rawType = (rowMap['property_type'] || rowMap['type'] || '').toLowerCase();
    if (rawType) {
      if (['residential', 'commercial', 'mixed_use', 'industrial'].includes(rawType)) {
        propType = rawType as ParsedUnitRow['property_type'];
      } else {
        errors.push(`Invalid property_type "${rawType}". Must be residential, commercial, mixed_use, or industrial`);
      }
    }

    // Bedrooms
    let bedrooms: number | undefined;
    if (rowMap['bedrooms'] || rowMap['beds']) {
      const b = parseInt(rowMap['bedrooms'] || rowMap['beds'], 10);
      if (isNaN(b) || b < 0) errors.push('Bedrooms must be a positive integer');
      else bedrooms = b;
    }

    // Bathrooms
    let bathrooms: number | undefined;
    if (rowMap['bathrooms'] || rowMap['baths']) {
      const b = parseInt(rowMap['bathrooms'] || rowMap['baths'], 10);
      if (isNaN(b) || b < 0) errors.push('Bathrooms must be a positive integer');
      else bathrooms = b;
    }

    // Monthly Rent
    let monthlyRent: number | undefined;
    if (rowMap['monthly_rent'] || rowMap['rent']) {
      const r = parseFloat(rowMap['monthly_rent'] || rowMap['rent']);
      if (isNaN(r) || r < 0) errors.push('Monthly rent must be a positive number');
      else monthlyRent = r;
    }

    const row: ParsedUnitRow = {
      rowIndex: i + 2, // 1-indexed, accounting for header
      unit_number: unitNumber,
      block_phase: rowMap['block_phase'] || rowMap['phase'] || rowMap['block'] || undefined,
      property_type: propType,
      bedrooms,
      bathrooms,
      monthly_rent: monthlyRent,
      handover_date: rowMap['handover_date'] || rowMap['handover'] || undefined,
      buyer_name: rowMap['buyer_name'] || rowMap['buyer'] || undefined,
      buyer_phone: rowMap['buyer_phone'] || rowMap['phone'] || undefined,
      buyer_email: rowMap['buyer_email'] || rowMap['email'] || undefined,
      isValid: errors.length === 0,
      errors,
    };

    rows.push(row);
  }

  const validCount = rows.filter((r) => r.isValid).length;
  const invalidCount = rows.length - validCount;

  return { rows, validCount, invalidCount, headers: rawHeaders };
}

export function generateSampleCsvTemplate(): string {
  const headers = [
    'unit_number',
    'block_phase',
    'property_type',
    'bedrooms',
    'bathrooms',
    'monthly_rent',
    'handover_date',
    'buyer_name',
    'buyer_phone',
    'buyer_email',
  ];

  const sampleRows = [
    ['Unit 101', 'Phase 1 - Acacia Block', 'residential', '3', '2', '4500', '2026-11-15', 'Kwame Mensah', '+233241234567', 'kwame@example.com'],
    ['Unit 102', 'Phase 1 - Acacia Block', 'residential', '2', '2', '3800', '2026-11-15', 'Abena Osei', '+233559876543', 'abena@example.com'],
    ['Unit 201', 'Phase 2 - Baobab Court', 'residential', '4', '4', '6500', '2026-12-01', 'Dr. Kofi Annan', '+233201122334', 'kofi.annan@example.com'],
    ['Shop A1', 'Commercial Plaza', 'commercial', '0', '1', '7200', '2026-11-01', 'Central Pharmacy Ltd', '+233302223344', 'contact@centralpharmacy.gh'],
    ['Unit 202', 'Phase 2 - Baobab Court', 'residential', '3', '3', '5200', '2026-12-01', 'Nana Serwaa', '+233244556677', 'nana.serwaa@example.com'],
  ];

  return [headers.join(','), ...sampleRows.map((r) => r.join(','))].join('\n');
}
