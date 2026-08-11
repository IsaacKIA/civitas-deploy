import { requireSectionAccess } from '@/lib/require-section-access';

export default async function TenantLayout({ children }: { children: React.ReactNode }) {
  await requireSectionAccess('tenant');
  return children;
}
