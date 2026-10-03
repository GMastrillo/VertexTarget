import test from 'node:test';
import assert from 'node:assert/strict';

import { publicDocument, generateSlug } from '../../src/lib/os/publication-utils.ts';
import { contactHref } from '../../src/lib/os/contact.ts';
import { validDocument } from './os-fixtures.mjs';

test('publicDocument creates clean whitelist DTO with zero private workspace or project fields', () => {
  const taintedInput = {
    ...validDocument,
    ownerId: 'private-user-uuid',
    workspaceId: 'private-workspace-uuid',
    prospectId: 'private-prospect-uuid',
    internalNotes: 'Confidential lead note',
    pricingStrategy: 'high-margin',
  };

  const clean = publicDocument(taintedInput);

  // Allowed public fields present
  assert.equal(clean.businessName, validDocument.businessName);
  assert.equal(clean.title, validDocument.title);
  assert.equal(clean.themeId, validDocument.themeId);
  assert.equal(clean.templateId, validDocument.templateId);
  assert.equal(clean.services.length, validDocument.services.length);

  // Private fields must be completely absent
  assert.equal('ownerId' in clean, false);
  assert.equal('workspaceId' in clean, false);
  assert.equal('prospectId' in clean, false);
  assert.equal('internalNotes' in clean, false);
  assert.equal('pricingStrategy' in clean, false);
});

test('generateSlug generates URL-safe slugs with Portuguese transliteration and unique suffix', () => {
  const slug1 = generateSlug('Café & Pão São Paulo!');
  assert.match(slug1, /^cafe-pao-sao-paulo-[a-z0-9]{6}$/);

  const slug2 = generateSlug('Café & Pão São Paulo!');
  assert.match(slug2, /^cafe-pao-sao-paulo-[a-z0-9]{6}$/);
  assert.notEqual(slug1, slug2, 'each slug should have a distinct random suffix');

  const slugEmpty = generateSlug('');
  assert.match(slugEmpty, /^site-[a-z0-9]{6}$/);
});

test('contactHref formats safe links and rejects dangerous schemes', () => {
  assert.equal(
    contactHref({ email: 'contato@teste.com' }),
    'mailto:contato@teste.com'
  );

  assert.equal(
    contactHref({ whatsapp: '5511999998888' }),
    'https://wa.me/5511999998888'
  );

  assert.equal(
    contactHref({ email: 'javascript:alert(1)' }),
    null
  );
});
