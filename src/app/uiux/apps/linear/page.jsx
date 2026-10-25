import AppRouteFrame from '@/components/liquid-glass/app-route-frame';
import LinearLiquidGlassApp from '@/components/liquid-glass/linear-app';

export const metadata = {
  title: 'Linear — Liquid Glass Redesign',
  description: 'An interactive Linear redesign study in the Omkar Kardile UI/UX portfolio.',
};

export default function LinearAppPage() {
  return (
    <AppRouteFrame brand='Linear' accent='#5E6AD2'>
      <LinearLiquidGlassApp />
    </AppRouteFrame>
  );
}
