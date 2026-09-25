import { requireSectionAccess } from '@/lib/require-section-access';

export default async function InstitutionLayout({ children }: { children: React.ReactNode }) {
  await requireSectionAccess('institution');
  return children;
}
