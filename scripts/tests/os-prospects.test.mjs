import test from 'node:test';
import assert from 'node:assert/strict';

import { parseProspectInput, documentFromBriefing } from '../../src/lib/os/validation.ts';

const validProspect = {
  name: 'Oficina Mecânica Precision',
  sector: 'Automotivo',
  city: 'Campinas - SP',
  website: 'https://precisionauto.test',
  email: 'contato@precisionauto.test',
  phone: '19999887766',
  notes: 'Cliente interessado em página de agendamento rápido via WhatsApp. Margem alta.',
};

test('parseProspectInput accepts valid prospect input', () => {
  const result = parseProspectInput(validProspect);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.name, validProspect.name);
    assert.equal(result.value.sector, validProspect.sector);
    assert.equal(result.value.city, validProspect.city);
    assert.equal(result.value.phone, '19999887766');
    assert.equal(result.value.notes, validProspect.notes);
  }
});

test('parseProspectInput rejects missing or empty prospect name', () => {
  const invalid = { ...validProspect, name: '   ' };
  const result = parseProspectInput(invalid);
  assert.equal(result.ok, false);
});

test('Creating briefing from prospect only uses public fields and never internal notes', () => {
  // Convert prospect to initial project briefing
  const briefing = {
    businessName: validProspect.name,
    sector: validProspect.sector,
    city: validProspect.city,
    objective: 'Captar clientes locais',
    description: `Atendimento automotivo especializado em ${validProspect.city}.`,
    services: [
      { title: 'Revisão Preventiva', description: 'Diagnóstico computadorizado completo.' },
    ],
    email: validProspect.email,
    whatsapp: validProspect.phone,
    templateId: 'local-services',
  };

  const doc = documentFromBriefing(briefing);

  // Assert document is clean and has no private notes
  assert.equal(doc.businessName, validProspect.name);
  assert.equal(doc.city, validProspect.city);
  assert.equal('notes' in doc, false);
  assert.equal(JSON.stringify(doc).includes('Margem alta'), false);
  assert.equal(JSON.stringify(doc).includes('Cliente interessado em página'), false);
});
