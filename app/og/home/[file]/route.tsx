import { renderOgImage } from '@/components/og-image';

export const revalidate = false;

/** Share card for the landing page, served at /og/home/image.png. */
export function GET() {
  return renderOgImage({
    title: 'Loop engineering, in the field',
    description:
      'Patterns, hints and tools for designing agentic loops: checkable goals, harnesses, microVM hosts, software factories and the failure modes to plan for.',
  });
}

export function generateStaticParams() {
  return [{ file: 'image.png' }];
}
