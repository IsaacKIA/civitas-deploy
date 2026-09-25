import { requireSectionAccess } from '@/lib/require-section-access';

export default async function DeveloperLayout({ children }: { children: React.ReactNode }) {
  await requireSectionAccess('developer');
  return children;
}
