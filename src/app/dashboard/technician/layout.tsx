import { requireSectionAccess } from '@/lib/require-section-access';

export default async function TechnicianLayout({ children }: { children: React.ReactNode }) {
  await requireSectionAccess('technician');
  return children;
}
