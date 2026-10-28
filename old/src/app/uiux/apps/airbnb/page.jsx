import AppRouteFrame from '@/components/liquid-glass/app-route-frame';
import AirbnbLiquidGlassApp from '@/components/liquid-glass/airbnb-app';

export const metadata = {
  title: 'Airbnb — Liquid Glass Redesign | Omkar Kardile',
  description: 'An interactive Airbnb redesign study in the Omkar Kardile UI/UX portfolio.',
};

export default function AirbnbAppPage() {
  return (
    <AppRouteFrame brand='Airbnb' accent='#FF5A5F'>
      <AirbnbLiquidGlassApp />
    </AppRouteFrame>
  );
}