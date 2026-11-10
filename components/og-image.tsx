import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { appName, appTagline } from '@/lib/shared';

export const ogSize = { width: 1200, height: 630 };

const red = '#d6331f';
const redLight = '#f2664a';

const fontFile = (weight: number) =>
  readFileSync(join(process.cwd(), `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`));

let fonts: { name: string; data: Buffer; weight: 400 | 600 | 800; style: 'normal' }[] | undefined;
function loadFonts() {
  fonts ??= ([400, 600, 800] as const).map((weight) => ({ name: 'Inter', data: fontFile(weight), weight, style: 'normal' }));
  return fonts;
}

/** Social cards show roughly two lines of description; cut at a word boundary. */
function clip(text: string, max = 125) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(' ', max)).replace(/[,;:.]$/, '')}…`;
}

const toDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

/** The favicon tile, read once at build time so the share card and the favicon never drift apart. */
let logoUri: string | undefined;
function logo() {
  logoUri ??= toDataUri(readFileSync(join(process.cwd(), 'app/icon.svg'), 'utf8'));
  return logoUri;
}

/** A large, faint copy of the loop mark used as a backdrop. */
const backdropUri = toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${redLight}" stop-opacity="0.32"/>
    <stop offset="1" stop-color="${red}" stop-opacity="0.04"/>
  </linearGradient></defs>
  <g stroke="url(#g)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 4a12 12 0 1 1-11.3 8"/><path d="M2.2 8.4 4.7 12l3.9-1.9"/>
  </g>
  <circle cx="16" cy="16" r="2.6" fill="${red}" fill-opacity="0.18"/>
</svg>`);

export function renderOgImage({
  title,
  description,
  section,
  path,
}: {
  title: string;
  description?: string;
  section?: string;
  path?: string;
}) {
  const titleSize = title.length > 48 ? 58 : title.length > 30 ? 66 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#121317',
          backgroundImage: 'radial-gradient(circle at 85% 40%, #2a1714 0%, #16171b 45%, #0f1013 100%)',
          color: '#eceef2',
          fontFamily: 'Inter',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={backdropUri} width={620} height={620} alt="" style={{ position: 'absolute', right: -110, top: 10 }} />

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '64px 72px 56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo()} width={84} height={84} alt="" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>{appName}</span>
              <span style={{ fontSize: 24, color: '#9a9fab' }}>{appTagline}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', maxWidth: 900 }}>
            {section ? (
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  color: redLight,
                  marginBottom: 14,
                }}
              >
                {section}
              </span>
            ) : null}
            <span style={{ fontSize: titleSize, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</span>
            {description ? (
              <span
                style={{
                  fontSize: 28,
                  lineHeight: 1.35,
                  color: '#b4b8c2',
                  marginTop: 22,
                }}
              >
                {clip(description)}
              </span>
            ) : null}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 36, gap: 16 }}>
            <div style={{ display: 'flex', width: 56, height: 6, borderRadius: 3, backgroundColor: red }} />
            <span style={{ fontSize: 22, color: '#8b909c' }}>{`loop.fun${path ?? ''}`}</span>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: loadFonts() },
  );
}
