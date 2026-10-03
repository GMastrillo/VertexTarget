import test from 'node:test';
import assert from 'node:assert/strict';

import { allowedOsReturnPath, safeAuthMessage } from '../../src/lib/os/auth-policy.ts';
import { parseAuthInput } from '../../src/lib/os/validation.ts';

test('allowedOsReturnPath restricts to safe internal /os paths with /os fallback', () => {
  // Safe /os paths
  assert.equal(allowedOsReturnPath('/os'), '/os');
  assert.equal(allowedOsReturnPath('/os/projetos'), '/os/projetos');
  assert.equal(allowedOsReturnPath('/os/configuracoes'), '/os/configuracoes');

  // External, protocol-relative, backslash or admin paths fall back to /os
  assert.equal(allowedOsReturnPath('https://malicious.com'), '/os');
  assert.equal(allowedOsReturnPath('//malicious.com'), '/os');
  assert.equal(allowedOsReturnPath('/os\\evil'), '/os');
  assert.equal(allowedOsReturnPath('/admin'), '/os');
  assert.equal(allowedOsReturnPath('/admin/crm'), '/os');
  assert.equal(allowedOsReturnPath('javascript:alert(1)'), '/os');
  assert.equal(allowedOsReturnPath(null), '/os');
  assert.equal(allowedOsReturnPath(123), '/os');
});

test('parseAuthInput validates signup action with password boundaries 12-128 and terms', () => {
  const baseSignup = {
    action: 'signup',
    name: 'Ana Lívia',
    email: 'ana.livia@exemplo.com.br',
    password: 'a'.repeat(12),
    termsAccepted: true,
    noticeVersion: '2026-10-02',
    captchaToken: 'test-token',
  };

  // 12 chars accepted
  const res12 = parseAuthInput(baseSignup);
  assert.equal(res12.ok, true);

  // 128 chars accepted
  const res128 = parseAuthInput({ ...baseSignup, password: 'b'.repeat(128) });
  assert.equal(res128.ok, true);

  // 11 chars rejected
  const res11 = parseAuthInput({ ...baseSignup, password: 'c'.repeat(11) });
  assert.equal(res11.ok, false);

  // 129 chars rejected
  const res129 = parseAuthInput({ ...baseSignup, password: 'd'.repeat(129) });
  assert.equal(res129.ok, false);

  // termsAccepted false rejected
  const resTerms = parseAuthInput({ ...baseSignup, termsAccepted: false });
  assert.equal(resTerms.ok, false);
});

test('parseAuthInput validates login, resend, recover and password actions', () => {
  // Login
  assert.equal(
    parseAuthInput({
      action: 'login',
      email: 'user@teste.com',
      password: 'password12345',
      captchaToken: 'token',
    }).ok,
    true
  );

  // Resend
  assert.equal(
    parseAuthInput({
      action: 'resend',
      email: 'user@teste.com',
      captchaToken: 'token',
    }).ok,
    true
  );

  // Recover
  assert.equal(
    parseAuthInput({
      action: 'recover',
      email: 'user@teste.com',
      captchaToken: 'token',
    }).ok,
    true
  );

  // Password reset
  assert.equal(
    parseAuthInput({
      action: 'password',
      password: 'newpassword123',
    }).ok,
    true
  );

  // Logout
  assert.equal(
    parseAuthInput({
      action: 'logout',
    }).ok,
    true
  );
});

test('safeAuthMessage returns sanitized friendly messages and suppresses secrets', () => {
  const rawErr = new Error('Database connection failed on postgresql://admin:secret@10.0.0.1:5432');
  const safe = safeAuthMessage(rawErr);
  assert.equal(safe.includes('secret'), false);
  assert.equal(safe.includes('postgresql'), false);
  assert.equal(typeof safe, 'string');
});
