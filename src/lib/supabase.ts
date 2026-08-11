import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Refusing to fall back to a hardcoded project — set real env vars.'
  );
}

// createBrowserClient (not the plain @supabase/supabase-js createClient) is
// required here: it stores the session in cookies instead of localStorage,
// which is what lets src/middleware.ts and every server component's
// getAuthedProfile() actually see a session after a user signs in on
// /portal. Using the plain client would mean sign-in "succeeds" in the
// browser but the server never sees it — every /dashboard/* request would
// look unauthenticated and bounce back to /portal in a loop.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  organization_id: string;
  role: 'super_admin' | 'org_admin' | 'ops_manager' | 'technician' | 'client' | 'tenant' | 'investor';
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  city?: string;
  country?: string;
  currency?: string;
}

export interface Property {
  id: string;
  organization_id: string;
  owner_id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  ghana_post_gps?: string;
  property_type: 'residential' | 'commercial' | 'mixed_use' | 'industrial';
  status: 'active' | 'vacant' | 'under_build' | 'maintenance' | 'archived';
  bedrooms?: number;
  bathrooms?: number;
  monthly_rent?: number;
  has_solar: boolean;
  solar_capacity_kwp?: number;
  has_smart_home: boolean;
}

export interface MaintenanceRequest {
  id: string;
  organization_id: string;
  request_number: string;
  property_id: string;
  client_id: string;
  assigned_tech_id?: string;
  category: 'hvac' | 'plumbing' | 'electrical' | 'cleaning' | 'landscaping' | 'smart_home' | 'roofing' | 'general';
  priority: 'low' | 'medium' | 'urgent' | 'emergency';
  status: 'new' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  title: string;
  description?: string;
  ai_urgency_score?: number;
  sla_deadline?: string;
  created_at: string;
  properties?: Partial<Property>;
}
