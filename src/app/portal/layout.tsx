import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Portal Sign In & Registration',
  description: 'Access your Civitas account: Landlord estate management, tenant Mobile Money rent portal, diaspora remote investor oversight, developer handover, and technician dispatch.',
  alternates: {
    canonical: 'https://civitasestate.com/portal',
  },
  openGraph: {
    title: 'Civitas Portal — Secure Sign In & Onboarding',
    description: 'Ghana’s integrated PropTech portal for landlords, tenants, diaspora owners, developers, and facility technicians.',
    url: 'https://civitasestate.com/portal',
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
