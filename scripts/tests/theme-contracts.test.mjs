import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const tokensPath = 'src/styles/theme-tokens.css';
const requiredTokens = [
  'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
  'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted',
  'muted-foreground', 'accent', 'accent-foreground', 'destructive', 'destructive-foreground',
  'border', 'input', 'ring', 'success', 'warning',
];

function variables(selector) {
  assert.equal(existsSync(tokensPath), true, 'Shared theme tokens must exist');
  const css = read(tokensPath);
  const block = css.match(new RegExp(`${selector}\\s*\\{([^}]+)\\}`));
  assert.ok(block, `Missing theme block: ${selector}`);
  return Object.fromEntries([...block[1].matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
}

function luminance(hex) {
  assert.match(hex, /^#[a-f\d]{6}$/i, 'Contrast pairs must be opaque six-digit colors');
  const linear = [1, 3, 5].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('both themes provide the same semantic interface and readable text pairs', () => {
  for (const selector of [':root', 'html\\.light']) {
    const vars = variables(selector);
    for (const token of requiredTokens) assert.ok(vars[token], `${selector}: missing ${token}`);
    for (const [foreground, background] of [
      ['foreground', 'background'], ['muted-foreground', 'background'],
      ['primary-foreground', 'primary'], ['destructive-foreground', 'destructive'],
      ['foreground', 'card'], ['success', 'card'], ['warning', 'card'],
    ]) assert.ok(contrast(vars[foreground], vars[background]) >= 4.5, `${selector}: low contrast ${foreground}/${background}`);
    assert.ok(contrast(vars.ring, vars.background) >= 3, `${selector}: invisible focus ring`);
    assert.ok(contrast(vars.input, vars.muted) >= 3, `${selector}: invisible input boundary`);
  }
});

test('Tailwind resolves semantic colors instead of duplicating fixed palettes', () => {
  assert.equal(existsSync(tokensPath), true);
  const css = read(tokensPath);
  assert.match(css, /@theme inline\s*\{/);
  for (const token of requiredTokens) assert.ok(css.includes(`--color-${token}: var(--${token})`));
  assert.match(css, /--color-vt-text:\s*var\(--foreground\)/);
  assert.match(css, /--color-vt-btn-primary-text:\s*var\(--primary-foreground\)/);
  assert.match(read('src/app/globals.css'), /@import "\.\.\/styles\/theme-tokens\.css"/);
});

test('workspace, auth and admin chrome use theme-aware neutral colors', () => {
  const folders = ['src/components/os', 'src/components/admin', 'src/app/os', 'src/app/admin', 'src/app/login'];
  const violations = [];
  for (const folder of folders) {
    for (const name of readdirSync(folder, { recursive: true }).filter((file) => file.endsWith('.tsx'))) {
      if (name === 'site-renderer.tsx') continue;
      const file = `${folder}/${name}`;
      const matches = read(file).match(/\b(?:text-white|text-slate-\d+|bg-slate-9\d+|bg-\[#(?:050510|0a0a1a|070716)\])/g);
      if (matches) violations.push({ file, colors: [...new Set(matches)] });
    }
  }
  assert.deepEqual(violations, [], 'Application chrome must not force a dark palette');
});

test('platform headings and surrounding laptop controls use the application theme', () => {
  for (const name of ['PlataformaHero.tsx', 'PlataformaNav.tsx', 'PlataformaPricing.tsx', 'laptop/LaptopSandboxBar.tsx', 'laptop/LaptopModeHeader.tsx']) {
    assert.equal(/\btext-white(?:\/|\s|["'])/.test(read(`src/components/plataforma/${name}`)), false, name);
  }
});

test('shared headings and auth inputs resolve font and control tokens correctly', () => {
  for (const file of ['src/app/login/page.tsx', 'src/components/admin/AdminUI.tsx', 'src/components/os/os-shell.tsx', 'src/app/cases/CasesIndexClient.tsx']) {
    assert.doesNotMatch(read(file), /font-\[var\(--font-heading\)\]/, file);
  }
  assert.match(read('src/components/os/auth-form-fields.tsx'), /border-input/);
});

test('theme control is available in private shells and has non-submit semantics', () => {
  for (const file of ['src/components/os/os-shell.tsx', 'src/components/admin/AdminShell.tsx']) assert.match(read(file), /<ThemeToggle/);
  assert.match(read('src/components/layout/ThemeToggle.tsx'), /type="button"/);
});

test('motion preference and laptop controls do not add motion on reduced or coarse pointers', () => {
  assert.match(read('src/providers/ThemeProvider.tsx'), /reducedMotion="user"/);
  assert.match(read('src/components/plataforma/Laptop3DShowcase.tsx'), /useReducedMotion/);
  assert.match(read('src/components/plataforma/Laptop3DShowcase.tsx'), /pointer: fine/);
  assert.match(read('src/components/plataforma/Laptop3DShowcase.tsx'), /mounted && reducedMotion/, 'Initial laptop transform must match SSR during reduced-motion hydration');
  assert.match(read('src/components/hero/HeroSection.tsx'), /prefers-reduced-motion: reduce/);
});

test('home scroll and WebGL effects respect reduced motion without hiding FAQ content', () => {
  for (const file of [
    'about/AboutSection.tsx', 'cases/CaseCard.tsx', 'cases/CasesSection.tsx',
    'contact/ContactSection.tsx', 'testimonials/TestimonialsSection.tsx', 'ai-lab/AILabSection.tsx',
    'services/ServicesSection.tsx',
  ]) assert.match(read(`src/components/${file}`), /prefers-reduced-motion: no-preference/, file);
  assert.match(read('src/components/services/ServicesSection.tsx'), /motion-reduce:overflow-x-auto/);
  assert.match(read('src/components/about/SkillsOrbit.tsx'), /if \(reducedMotion\) return/);
  assert.doesNotMatch(read('src/components/faq/FAQSection.tsx'), /style=\{\{ opacity: 0, transform:/);
});

test('mobile navigation exposes state and supports Escape dismissal', () => {
  assert.match(read('src/hooks/useEscapeDismiss.ts'), /event.key === "Escape"/);
  for (const file of ['src/components/plataforma/PlataformaNav.tsx', 'src/components/layout/Navigation.tsx']) {
    assert.match(read(file), /aria-expanded=/);
    assert.match(read(file), /useEscapeDismiss/);
  }
});

test('admin follows the document color scheme and shared controls do not force white hover', () => {
  assert.doesNotMatch(read('src/app/globals.css'), /\.admin-shell\s*\{[^}]*color-scheme:\s*dark/s);
  const button = read('src/components/ui/button.tsx');
  assert.match(button, /bg-primary text-primary-foreground/);
  assert.doesNotMatch(button, /hover:text-white|text-\[#050510\]/);
  assert.doesNotMatch(read('src/components/ui/dialog.tsx'), /hover:text-white/);
});
