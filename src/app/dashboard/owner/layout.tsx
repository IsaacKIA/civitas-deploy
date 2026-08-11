import { requireSectionAccess } from '@/lib/require-section-access';

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  await requireSectionAccess('owner');
  return children;
}
