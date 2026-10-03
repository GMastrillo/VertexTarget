import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ECOSYSTEM_NAV,
  ECOSYSTEM_AREAS,
  ECOSYSTEM_FREE_TIER_FEATURES,
} from '../../src/lib/ecosystem-content.ts';

test('ECOSYSTEM_NAV defines valid accessible navigation links', () => {
  assert.ok(Array.isArray(ECOSYSTEM_NAV));
  assert.ok(ECOSYSTEM_NAV.length >= 3);
  for (const item of ECOSYSTEM_NAV) {
    assert.ok(typeof item.label === 'string' && item.label.length > 0);
    assert.ok(typeof item.href === 'string' && item.href.startsWith('/'));
    assert.notEqual(item.href, '#');
  }
});

test('ECOSYSTEM_AREAS accurately separates available products from preparing initiatives', () => {
  assert.ok(Array.isArray(ECOSYSTEM_AREAS));
  const osArea = ECOSYSTEM_AREAS.find((a) => a.id === 'vertex-os');
  assert.ok(osArea, 'Vertex OS area must exist');
  assert.equal(osArea.status, 'available');
  assert.equal(osArea.href, '/os/cadastro');

  const educationArea = ECOSYSTEM_AREAS.find((a) => a.id === 'education');
  if (educationArea) {
    assert.equal(educationArea.status, 'preparing');
  }

  const communityArea = ECOSYSTEM_AREAS.find((a) => a.id === 'community');
  if (communityArea) {
    assert.equal(communityArea.status, 'preparing');
  }
});

test('ECOSYSTEM_FREE_TIER_FEATURES matches exact FREE_LIMITS without deceptive claims', () => {
  assert.equal(ECOSYSTEM_FREE_TIER_FEATURES.maxWorkspaces, 1);
  assert.equal(ECOSYSTEM_FREE_TIER_FEATURES.maxProjects, 1);
  assert.equal(ECOSYSTEM_FREE_TIER_FEATURES.maxPublishedSites, 1);
  assert.equal(ECOSYSTEM_FREE_TIER_FEATURES.monthlyCopyLimit, 3);
  assert.equal(ECOSYSTEM_FREE_TIER_FEATURES.monthlySearchLimit, 1);
  assert.equal(ECOSYSTEM_FREE_TIER_FEATURES.maxProspects, 50);

  const serialized = JSON.stringify(ECOSYSTEM_AREAS);
  assert.equal(serialized.includes('<1 minuto'), false, 'no deceptive speed claims');
  assert.equal(serialized.includes('garantia de 100%'), false, 'no exaggerated marketing claims');
});
