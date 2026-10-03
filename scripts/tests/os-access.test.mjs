import test from 'node:test';
import assert from 'node:assert/strict';

import {
  confirmedIdentity,
  assertActiveWorkspace,
} from '../../src/lib/os/auth-policy.ts';
import { OsError } from '../../src/lib/os/errors.ts';

test('confirmedIdentity accepts user with confirmed email', () => {
  const supabaseUser = {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'cliente@exemplo.com.br',
    email_confirmed_at: '2026-10-02T10:00:00Z',
    user_metadata: { role: 'owner', plan: 'unlimited' }, // forged metadata
  };

  const identity = confirmedIdentity(supabaseUser);
  assert.ok(identity);
  assert.equal(identity.userId, '11111111-1111-1111-1111-111111111111');
  assert.equal(identity.email, 'cliente@exemplo.com.br');
  // Metadata role or plan must NEVER be in identity
  assert.equal('role' in identity, false);
  assert.equal('plan' in identity, false);
});

test('confirmedIdentity rejects unconfirmed or missing email', () => {
  const unconfirmed = {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'unconfirmed@exemplo.com.br',
    email_confirmed_at: null,
  };
  assert.equal(confirmedIdentity(unconfirmed), null);

  const missingEmail = {
    id: '11111111-1111-1111-1111-111111111111',
    email_confirmed_at: '2026-10-02T10:00:00Z',
  };
  assert.equal(confirmedIdentity(missingEmail), null);
  assert.equal(confirmedIdentity(null), null);
});

test('assertActiveWorkspace permits active workspace and rejects suspended/deleted', () => {
  const identity = {
    userId: '11111111-1111-1111-1111-111111111111',
    email: 'cliente@exemplo.com.br',
  };

  const activeWorkspace = {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Workspace Ativo',
    journey: 'business',
    status: 'active',
    plan: 'free',
  };

  const ctx = assertActiveWorkspace(identity, activeWorkspace);
  assert.equal(ctx.userId, identity.userId);
  assert.equal(ctx.workspace.id, activeWorkspace.id);

  // Suspended
  assert.throws(
    () => {
      assertActiveWorkspace(identity, { ...activeWorkspace, status: 'suspended' });
    },
    (err) => {
      assert.ok(err instanceof OsError);
      assert.equal(err.code, 'forbidden');
      assert.equal(err.status, 403);
      return true;
    }
  );

  // Deleted
  assert.throws(
    () => {
      assertActiveWorkspace(identity, { ...activeWorkspace, status: 'deleted' });
    },
    (err) => {
      assert.ok(err instanceof OsError);
      assert.equal(err.code, 'not-found');
      assert.equal(err.status, 404);
      return true;
    }
  );

  // Null
  assert.throws(
    () => {
      assertActiveWorkspace(identity, null);
    },
    (err) => {
      assert.ok(err instanceof OsError);
      assert.equal(err.code, 'not-found');
      assert.equal(err.status, 404);
      return true;
    }
  );
});
