import { renderOgImage } from '@/components/og-image';

export const revalidate = false;

/** Share card for the landing page, served at /og/home/image.png. */
export function GET() {
  return renderOgImage({
    title: 'Loops, goals and harnesses, explained',
    description:
      'How goal loops, scheduled loops and harnesses work across Claude Code, Codex, Hermes, Antigravity and OpenClaw, and where they still fall short.',
  });
}

export function generateStaticParams() {
  return [{ file: 'image.png' }];
}
