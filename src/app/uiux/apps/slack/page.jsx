import AppRouteFrame from '@/components/liquid-glass/app-route-frame';
import SlackLiquidGlassApp from '@/components/liquid-glass/slack-app';

export const metadata = {
  title: 'Slack — Liquid Glass Redesign | Omkar Kardile',
  description: 'An interactive Slack redesign study in the Omkar Kardile UI/UX portfolio.',
};

export default function SlackAppPage() {
  return (
    <AppRouteFrame brand='Slack' accent='#4A154B'>
      <SlackLiquidGlassApp />
    </AppRouteFrame>
  );
}