/**
 * Single source of truth for property status. Must match the `status`
 * check constraint on the `properties` table and the `Property` interface
 * in src/lib/supabase.ts. Two dashboard pages had drifted to inventing
 * 'occupied' / 'under_maintenance' as display values that don't actually
 * exist in that enum — this file exists so that can't happen silently
 * again.
 */
export type PropertyStatus = 'active' | 'vacant' | 'under_build' | 'maintenance' | 'archived';

export const PROPERTY_STATUS_LABEL: Record<PropertyStatus, string> = {
  active: 'Occupied',
  vacant: 'Vacant',
  under_build: 'Under Construction',
  maintenance: 'Under Maintenance',
  archived: 'Archived',
};

export const PROPERTY_STATUS_STYLE: Record<PropertyStatus, string> = {
  active: 'bg-[#EEF7F2] text-[#1A5C3A]',
  vacant: 'bg-[#FEF3C7] text-[#D97706]',
  under_build: 'bg-[#EFF6FF] text-[#2563EB]',
  maintenance: 'bg-[#FDECEA] text-[#D94F3D]',
  archived: 'bg-[#F5F9F6] text-[#6B7E72]',
};
