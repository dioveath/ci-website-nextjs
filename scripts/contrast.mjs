#!/usr/bin/env node
/**
 * Design-token contrast gate.
 *
 * Reads the token values straight out of `styles/globals.css` rather than
 * keeping its own copy, so the gate can never drift from the stylesheet: edit
 * a token and the next run re-verifies it.
 *
 * Checked against WCAG 2.1:
 *   1.4.3 Contrast (Minimum)       — 4.5:1 for body text, 3:1 for large text
 *   1.4.11 Non-text Contrast       — 3:1 for UI component boundaries and
 *                                    focus indicators
 *
 * Usage: node scripts/contrast.mjs [--verbose]
 * Exits non-zero if any declared pair falls below its minimum.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STYLESHEET = join(ROOT, 'styles', 'globals.css');

/* ------------------------------------------------------------------ colour */

/** sRGB hex (#rgb, #rrggbb) -> [r, g, b] in 0..1 */
function parseHex(hex) {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`not a hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

/** WCAG 2.x relative luminance. */
function luminance(hex) {
  const [r, g, b] = parseHex(hex).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio, 1..21. */
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* ------------------------------------------------------------------- parse */

/**
 * Pull `--name: value;` declarations out of one top-level CSS block.
 * Deliberately simple: the token blocks are flat lists of custom properties,
 * so a brace-matched slice plus a declaration regex is enough, and it keeps
 * this gate dependency-free.
 */
function readTokenBlock(css, selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`no \`${selector}\` block in styles/globals.css`);

  const open = css.indexOf('{', start);
  let depth = 0;
  let end = -1;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) {
      end = i;
      break;
    }
  }
  if (end === -1) throw new Error(`unterminated \`${selector}\` block`);

  const tokens = {};
  const body = css.slice(open + 1, end).replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [, name, value] of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
}

/* --------------------------------------------------------------- the pairs */

/**
 * The contract. Every pair the UI actually puts next to each other, with the
 * WCAG minimum that applies to it. `min: 3` entries are UI boundaries and
 * focus rings (1.4.11), not text.
 *
 * Token names, not literals — so this list reads as the design intent and the
 * values come from the stylesheet.
 */
const PAIRS = [
  ['foreground', 'background', 4.5, 'body text on the page'],
  ['muted-foreground', 'background', 4.5, 'secondary text on the page'],
  ['card-foreground', 'card', 4.5, 'body text in a card'],
  ['muted-foreground', 'card', 4.5, 'secondary text in a card'],
  ['foreground', 'muted', 4.5, 'body text on a muted surface'],
  ['primary-foreground', 'primary', 4.5, 'primary button label'],
  ['destructive-foreground', 'destructive', 4.5, 'destructive button label'],
  ['primary', 'background', 4.5, 'primary used as link text'],
  ['destructive', 'background', 4.5, 'error text on the page'],
  ['destructive', 'card', 4.5, 'error text in a card'],
  ['secondary-foreground', 'secondary', 4.5, 'secondary button label'],
  ['accent-foreground', 'accent', 4.5, 'label on a hovered item'],
  ['highlight-foreground', 'highlight', 4.5, 'brand highlight chip label'],
  ['input', 'background', 3, 'field border on the page (1.4.11)'],
  ['input', 'card', 3, 'field border in a card (1.4.11)'],
  ['ring', 'background', 3, 'focus ring on the page (1.4.11)'],
  ['ring', 'card', 3, 'focus ring in a card (1.4.11)'],
  ['primary', 'card', 3, 'primary button against a card (1.4.11)'],
  ['on-brand', 'brand-from', 4.5, 'text on the brand band, light stop'],
  ['on-brand', 'brand-to', 4.5, 'text on the brand band, dark stop'],
  ['on-brand-muted', 'brand-from', 4.5, 'secondary text on the brand band'],
  ['on-brand-muted', 'brand-to', 4.5, 'secondary text on the brand band'],
];

/* -------------------------------------------------------------------- main */

const verbose = process.argv.includes('--verbose');
const css = await readFile(STYLESHEET, 'utf8');

const themes = [
  ['light', readTokenBlock(css, ':root')],
  ['dark', readTokenBlock(css, '.dark')],
];

let failures = 0;
let checked = 0;
const missing = new Set();

for (const [themeName, tokens] of themes) {
  const rows = [];

  for (const [fgName, bgName, min, label] of PAIRS) {
    const fg = tokens[fgName];
    const bg = tokens[bgName];
    if (!fg || !bg) {
      missing.add(`${themeName}: ${!fg ? `--${fgName}` : `--${bgName}`}`);
      continue;
    }

    const ratio = contrast(fg, bg);
    const ok = ratio >= min;
    checked++;
    if (!ok) failures++;
    if (!ok || verbose) {
      rows.push(
        `  ${ok ? 'ok  ' : 'FAIL'} ${ratio.toFixed(2).padStart(5)}:1 ` +
          `(min ${min.toFixed(1)})  ${label}\n` +
          `       --${fgName} ${fg} on --${bgName} ${bg}`
      );
    }
  }

  if (rows.length) {
    console.log(`\n${themeName}`);
    console.log(rows.join('\n'));
  }
}

if (missing.size) {
  console.error(`\nundeclared tokens:\n  ${[...missing].join('\n  ')}`);
  process.exit(1);
}

if (failures) {
  console.error(
    `\n${failures} of ${checked} token pairs fall below their WCAG minimum.`
  );
  process.exit(1);
}

console.log(`\n${checked} token pairs meet their WCAG minimum in both themes.`);
