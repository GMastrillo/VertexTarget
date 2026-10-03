import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { createRecoveryProof, verifyRecoveryProof } from '../../src/lib/os/auth-recovery.ts';
import { contactHref, isSafeHttpUrl } from '../../src/lib/os/contact.ts';
import { parseGroundedResult } from '../../src/lib/os/ai-validation.ts';
import robots from '../../src/app/robots.ts';
import sitemap from '../../src/app/sitemap.ts';
import nextConfig from '../../next.config.ts';

test('createRecoveryProof and verifyRecoveryProof validate HMAC cryptographic proof', () => {
  const userId = 'usr-sec-123';
  const email = 'auditor@vertex.test';
  const token = createRecoveryProof(userId, email);

  assert.ok(typeof token === 'string' && token.includes('.'));
  const verified = verifyRecoveryProof(token);
  assert.ok(verified, 'Proof token must be verified');
  assert.equal(verified?.userId, userId);
  assert.equal(verified?.email, email);

  // Tampered signature
  const [payload, sig] = token.split('.');
  const forgedSig = sig.slice(0, -2) + (sig.endsWith('a') ? 'b' : 'a');
  assert.equal(verifyRecoveryProof(`${payload}.${forgedSig}`), null, 'Tampered signature must fail');

  // Tampered payload
  const forgedPayload = Buffer.from(JSON.stringify({ userId: 'hacker', email, exp: Date.now() + 100000 })).toString('base64url');
  assert.equal(verifyRecoveryProof(`${forgedPayload}.${sig}`), null, 'Tampered payload must fail');

  // Malformed inputs
  assert.equal(verifyRecoveryProof(null), null);
  assert.equal(verifyRecoveryProof(''), null);
  assert.equal(verifyRecoveryProof('invalid-token-without-dot'), null);
});

test('contactHref and isSafeHttpUrl strictly sanitize links and prevent XSS/dangerous protocols', () => {
  assert.equal(contactHref({ whatsapp: '11999998888' }), 'https://wa.me/5511999998888');
  assert.equal(contactHref({ email: 'contato@vertex.test' }), 'mailto:contato@vertex.test');
  assert.equal(contactHref({ whatsapp: 'invalid' }), null);
  assert.equal(contactHref({ email: 'invalid-email' }), null);

  // Safe HTTP/HTTPS urls
  assert.equal(isSafeHttpUrl('https://example.com/site'), true);
  assert.equal(isSafeHttpUrl('http://example.com/page?query=1'), true);

  // Dangerous protocols must be rejected
  assert.equal(isSafeHttpUrl('javascript:alert(1)'), false);
  assert.equal(isSafeHttpUrl('data:text/html,<script>alert(1)</script>'), false);
  assert.equal(isSafeHttpUrl('file:///etc/passwd'), false);
  assert.equal(isSafeHttpUrl('vbscript:msgbox(1)'), false);
  assert.equal(isSafeHttpUrl(''), false);
});

test('parseGroundedResult sanitizes and limits search recommendations', () => {
  const unsafePayload = {
    suggestions: [
      {
        name: 'Segurança Tech',
        city: 'São Paulo',
        sector: 'Tecnologia',
        phone: '11999990000',
        hypothesis: 'Melhore a segurança do seu site com auditoria contínua',
        website: 'javascript:alert(1)',
        sources: [
          { url: 'javascript:alert(1)', title: 'Unsafe' },
        ],
      },
    ],
  };

  const unsafeRes = parseGroundedResult(unsafePayload);
  assert.equal(unsafeRes.ok, false, 'Payload with unsafe schemes must be rejected');

  const safePayload = {
    suggestions: [
      {
        name: 'Segurança Tech',
        city: 'São Paulo',
        sector: 'Tecnologia',
        phone: '11999990000',
        hypothesis: 'Melhore a segurança do seu site com auditoria contínua',
        website: 'https://seg.com.br',
        sources: [
          { url: 'https://seg.com.br/sobre', title: 'Sobre a Empresa' },
        ],
      },
    ],
  };

  const safeRes = parseGroundedResult(safePayload);
  assert.equal(safeRes.ok, true, 'Valid payload must be accepted');
  if (safeRes.ok) {
    assert.equal(safeRes.value.suggestions.length, 1);
    assert.equal(safeRes.value.suggestions[0].name, 'Segurança Tech');
    assert.equal(safeRes.value.suggestions[0].sources[0].url, 'https://seg.com.br/sobre');
  }
});

test('robots and sitemap protect administrative and private routes', () => {
  const robotsData = robots();
  const rules = robotsData.rules;
  assert.ok(Array.isArray(rules) ? rules.length > 0 : Boolean(rules));
  const mainRule = Array.isArray(rules) ? rules[0] : rules;
  const disallowed = Array.isArray(mainRule.disallow) ? mainRule.disallow : [mainRule.disallow];

  assert.ok(disallowed.includes('/os/'), 'robots.txt must disallow /os/');
  assert.ok(disallowed.includes('/admin/'), 'robots.txt must disallow /admin/');
  assert.ok(disallowed.includes('/api/'), 'robots.txt must disallow /api/');

  const sitemapData = sitemap();
  assert.ok(Array.isArray(sitemapData));
  for (const entry of sitemapData) {
    assert.ok(!entry.url.includes('/os/'), 'sitemap must not include /os/');
    assert.ok(!entry.url.includes('/admin/'), 'sitemap must not include /admin/');
    assert.ok(!entry.url.includes('/api/'), 'sitemap must not include /api/');
  }
});

test('nextConfig sets strict security headers, CSP, and no-store for protected paths', async () => {
  assert.ok(typeof nextConfig.headers === 'function');
  const headersRules = await nextConfig.headers();
  assert.ok(Array.isArray(headersRules));

  const globalRule = headersRules.find((r) => r.source === '/(.*)');
  assert.ok(globalRule, 'Global headers rule must exist');
  const headerKeys = globalRule.headers.map((h) => h.key);
  assert.ok(headerKeys.includes('Content-Security-Policy'));
  assert.ok(headerKeys.includes('X-Content-Type-Options'));
  assert.ok(headerKeys.includes('X-Frame-Options'));
  assert.ok(headerKeys.includes('Strict-Transport-Security'));

  const cspVal = globalRule.headers.find((h) => h.key === 'Content-Security-Policy')?.value;
  assert.ok(cspVal?.includes("default-src 'self'"));
  assert.ok(cspVal?.includes('https://*.hcaptcha.com'));

  const protectedAppRule = headersRules.find((r) => r.source.includes('os|admin'));
  assert.ok(protectedAppRule, 'Protected app routes must have dedicated headers');
  const cacheControl = protectedAppRule.headers.find((h) => h.key === 'Cache-Control')?.value;
  const robotsTag = protectedAppRule.headers.find((h) => h.key === 'X-Robots-Tag')?.value;
  assert.ok(cacheControl?.includes('no-store'));
  assert.ok(robotsTag?.includes('noindex'));
});

test('Client component trees do not reference server-only secrets', () => {
  const forbiddenPatterns = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'AUTH_RECOVERY_SECRET',
    'REQUEST_LIMIT_SECRET',
    'GEMINI_API_KEY',
  ];

  const clientDirectories = [
    path.resolve(process.cwd(), 'src/components'),
    path.resolve(process.cwd(), 'src/app/sites'),
  ];

  function checkDir(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        checkDir(fullPath);
      } else if (/\.(tsx|ts|js|jsx)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const pattern of forbiddenPatterns) {
          const regex = new RegExp(`process\\.env\\.${pattern}`, 'g');
          assert.equal(
            regex.test(content),
            false,
            `File ${entry.name} must not access process.env.${pattern}`
          );
        }
      }
    }
  }

  for (const dir of clientDirectories) {
    checkDir(dir);
  }
});
