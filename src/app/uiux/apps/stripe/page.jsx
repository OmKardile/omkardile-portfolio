import AppRouteFrame from '@/components/liquid-glass/app-route-frame';
import StripeLiquidGlassApp from '@/components/liquid-glass/stripe-app';

export const metadata = {
  title: 'Stripe — Liquid Glass Redesign | Omkar Kardile',
  description: 'An interactive Stripe redesign study in the Omkar Kardile UI/UX portfolio.',
};

export default function StripeAppPage() {
  return (
    <AppRouteFrame brand='Stripe' accent='#635BFF'>
      <StripeLiquidGlassApp />
    </AppRouteFrame>
  );
}