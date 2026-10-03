import test from 'node:test';
import assert from 'node:assert/strict';

import { parseGroundedResult } from '../../src/lib/os/ai-validation.ts';

const validSearchResult = {
  searchedAt: new Date().toISOString(),
  attributionHtml: null,
  suggestions: [
    {
      name: 'Padaria e Confeitaria Bella Vista',
      sector: 'Alimentação',
      city: 'Santos - SP',
      website: 'https://bellavista.test',
      phone: '1332221100',
      hypothesis: 'Comércio tradicional sem pedidos online ou cardápio digital estruturado.',
      sources: [
        {
          url: 'https://maps.google.com/bellavista',
          title: 'Google Maps - Bella Vista Santos',
        },
      ],
    },
  ],
};

test('parseGroundedResult accepts valid search result with verified sources', () => {
  const parsed = parseGroundedResult(validSearchResult);
  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.equal(parsed.value.suggestions.length, 1);
    assert.equal(parsed.value.suggestions[0].name, 'Padaria e Confeitaria Bella Vista');
    assert.equal(parsed.value.suggestions[0].sources[0].url, 'https://maps.google.com/bellavista');
  }
});

test('parseGroundedResult rejects suggestions without verified sources', () => {
  const invalid = {
    ...validSearchResult,
    suggestions: [
      {
        name: 'Empresa Fantasma',
        sector: 'Tech',
        city: 'SP',
        website: '',
        phone: '',
        hypothesis: 'Nenhuma fonte',
        sources: [], // Empty sources
      },
    ],
  };

  const parsed = parseGroundedResult(invalid);
  assert.equal(parsed.ok, false);
});

test('parseGroundedResult rejects dangerous URL schemes in source or website', () => {
  const withDangerousSource = {
    ...validSearchResult,
    suggestions: [
      {
        ...validSearchResult.suggestions[0],
        sources: [
          {
            url: 'javascript:alert(1)',
            title: 'Malicious Source',
          },
        ],
      },
    ],
  };

  const parsed = parseGroundedResult(withDangerousSource);
  assert.equal(parsed.ok, false);

  const withDangerousWebsite = {
    ...validSearchResult,
    suggestions: [
      {
        ...validSearchResult.suggestions[0],
        website: 'data:text/html,<script>alert(1)</script>',
      },
    ],
  };

  const parsedWebsite = parseGroundedResult(withDangerousWebsite);
  assert.equal(parsedWebsite.ok, false);
});

test('parseGroundedResult caps suggestions at maximum 10 items', () => {
  const oversized = {
    ...validSearchResult,
    suggestions: Array.from({ length: 15 }, (_, i) => ({
      ...validSearchResult.suggestions[0],
      name: `Empresa ${i + 1}`,
    })),
  };

  const parsed = parseGroundedResult(oversized);
  assert.equal(parsed.ok, false);
});
