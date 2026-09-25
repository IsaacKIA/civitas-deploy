import { requireSectionAccess } from '@/lib/require-section-access';

export default async function SmeLayout({ children }: { children: React.ReactNode }) {
  await requireSectionAccess('sme');
  return children;
}
