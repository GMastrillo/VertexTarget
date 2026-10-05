import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SANDBOX_NICHES,
  generateCustomSiteDemo,
} from '../../src/components/plataforma/laptop/laptop-sandbox-generator.ts';

test('Sandbox Generator: gera dados válidos para nome e nicho informados', () => {
  const demo = generateCustomSiteDemo('Barbearia Vintage', 'servicos', 'Porto Alegre, RS');

  assert.equal(demo.name, 'Barbearia Vintage');
  assert.equal(demo.city, 'Porto Alegre, RS');
  assert.equal(demo.accent, '#ff9900');
  assert.ok(demo.headline.includes('Barbearia Vintage'));
  assert.ok(demo.sub.includes('Porto Alegre, RS'));
  assert.ok(Array.isArray(demo.features));
  assert.ok(demo.features.length >= 3);
});

test('Sandbox Generator: fallback gracioso para inputs vazios', () => {
  const demo = generateCustomSiteDemo('   ', 'invalido', '   ');

  assert.equal(demo.name, 'Sua Marca Aqui');
  assert.equal(demo.city, 'Sua Cidade, BR');
  assert.equal(demo.accent, '#00f0ff'); // fallback para o primeiro nicho (saude)
  assert.ok(demo.headline.includes('Sua Marca Aqui'));
  assert.ok(demo.sub.includes('Sua Cidade, BR'));
});

test('Sandbox Generator: todos os presets possuem templates e cores válidas', () => {
  assert.ok(SANDBOX_NICHES.length >= 6);

  for (const preset of SANDBOX_NICHES) {
    assert.ok(preset.id);
    assert.ok(preset.label);
    assert.ok(preset.accent.startsWith('#'));
    assert.ok(['services', 'commerce', 'consulting'].includes(preset.defaultTemplateId));

    const generated = generateCustomSiteDemo('Empresa Teste', preset.id, 'São Paulo, SP');
    assert.equal(generated.category, preset.label);
    assert.equal(generated.accent, preset.accent);
  }
});
