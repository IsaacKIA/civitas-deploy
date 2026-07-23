import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wbjyktvvmcnbihbcunvg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndianlrdHZ2bWNuYmloYmN1bnZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwODkzMTQsImV4cCI6MjA5NDY2NTMxNH0.1lp6DyfT3xA-dC_M63em-H3j5UED-WPwJ741GZHRV40';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
