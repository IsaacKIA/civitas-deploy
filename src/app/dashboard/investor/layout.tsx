import { requireSectionAccess } from '@/lib/require-section-access';

export default async function InvestorLayout({ children }: { children: React.ReactNode }) {
  await requireSectionAccess('investor');
  return children;
}
