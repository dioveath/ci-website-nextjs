import { ImageResponse } from 'next/og';

import { SITE_DESCRIPTION, SITE_NAME } from '../lib/site';

export const alt = `${SITE_NAME} — computer training in Belbari, Morang`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The default link preview.
 *
 * Values are written out rather than read from styles/globals.css: Satori
 * resolves no CSS variables and supports no external stylesheet, so the only
 * way to use the tokens here would be to inline them. They are the light
 * theme's --brand-from, --brand-to, --on-brand and --highlight.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundImage: 'linear-gradient(135deg, #0a5b4f 0%, #0c2326 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif'
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '64px',
            height: '6px',
            borderRadius: '999px',
            backgroundColor: '#efb53a',
            marginBottom: '40px'
          }}
        />
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, letterSpacing: '-0.02em' }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '24px',
            fontSize: 30,
            lineHeight: 1.4,
            color: '#d6eae6',
            maxWidth: '900px'
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    size
  );
}
