export type MaintenanceCategory =
  | 'electrical'
  | 'plumbing'
  | 'hvac'
  | 'structural'
  | 'solar'
  | 'cleaning'
  | 'smart_home'
  | 'general';

export type MaintenancePriority = 'emergency' | 'urgent' | 'standard' | 'low';

export const MAINTENANCE_CATEGORIES: { id: MaintenanceCategory; label: string; icon: string; description: string }[] = [
  { id: 'electrical', label: 'Electrical', icon: '⚡', description: 'Power, wiring, sockets, lights' },
  { id: 'plumbing', label: 'Plumbing', icon: '🚿', description: 'Pipes, taps, drainage, water' },
  { id: 'hvac', label: 'HVAC / AC', icon: '❄️', description: 'Air conditioning, ventilation' },
  { id: 'structural', label: 'Structural', icon: '🏗️', description: 'Walls, roof, doors, windows' },
  { id: 'solar', label: 'Solar / IoT', icon: '☀️', description: 'Panels, inverter, battery, smart devices' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹', description: 'Deep cleaning, fumigation, waste' },
  { id: 'smart_home', label: 'Smart Home', icon: '🏠', description: 'Security cameras, locks, automation' },
  { id: 'general', label: 'General', icon: '🔧', description: 'Other maintenance needs' },
];

export const MAINTENANCE_PRIORITIES: {
  id: MaintenancePriority;
  label: string;
  desc: string;
  slaHours: number;
  slaLabel: string;
  color: string;
  bg: string;
}[] = [
  { id: 'emergency', label: '🚨 Emergency', desc: 'Safety risk / flooding / no power', slaHours: 2, slaLabel: '2-hour response', color: '#D94F3D', bg: '#FDECEA' },
  { id: 'urgent', label: '⚠️ Urgent', desc: 'Severely affecting daily life', slaHours: 24, slaLabel: '24-hour response', color: '#D97706', bg: '#FEF3C7' },
  { id: 'standard', label: '🔵 Standard', desc: 'Important but not time-critical', slaHours: 72, slaLabel: '72-hour response', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'low', label: '⬇️ Low', desc: 'Minor inconvenience, can wait', slaHours: 168, slaLabel: '7-day response', color: '#6B7E72', bg: '#F5F9F6' },
];

export function slaHoursFor(priority: MaintenancePriority): number {
  return MAINTENANCE_PRIORITIES.find((p) => p.id === priority)?.slaHours ?? 72;
}

export function generateMaintenanceReference(): string {
  const year = new Date().getFullYear();
  return `MR-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

export const MAINTENANCE_STATUS_STYLE: Record<string, string> = {
  new: 'bg-[#F5F9F6] text-[#6B7E72]',
  assigned: 'bg-[#D4EFE6] text-[#2E8B6A]',
  in_progress: 'bg-[#FEF3C7] text-[#D97706]',
  completed: 'bg-[#EEF7F2] text-[#1A5C3A]',
  cancelled: 'bg-[#FDECEA] text-[#D94F3D]',
};
