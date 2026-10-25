import AppRouteFrame from '@/components/liquid-glass/app-route-frame';
import LinkedInLiquidGlassApp from '@/components/liquid-glass/linkedin-app';

export const metadata = {
  title: 'LinkedIn — Liquid Glass Redesign | Omkar Kardile',
  description: 'An interactive LinkedIn redesign study in the Omkar Kardile UI/UX portfolio.',
};

export default function LinkedInAppPage() {
  return (
    <AppRouteFrame brand='LinkedIn' accent='#0A66C2'>
      <LinkedInLiquidGlassApp />
    </AppRouteFrame>
  );
}