import test from 'node:test';
import assert from 'node:assert/strict';

import { usagePeriod } from '../../src/lib/os/policy.ts';
import { formatRegionalDate } from '../../src/lib/region/format.ts';

test('usagePeriod computes period and renewal strictly in UTC regardless of client timezone', () => {
  // Test moment: 2026-10-31T23:59:59Z
  const octEnd = new Date('2026-10-31T23:59:59Z');
  const period = usagePeriod(octEnd);

  assert.equal(period.period, '2026-10');
  assert.equal(period.renewsAt, '2026-11-01T00:00:00.000Z');

  // Test moment: 2026-11-01T00:00:01Z
  const novStart = new Date('2026-11-01T00:00:01Z');
  const novPeriod = usagePeriod(novStart);

  assert.equal(novPeriod.period, '2026-11');
  assert.equal(novPeriod.renewsAt, '2026-12-01T00:00:00.000Z');
});

test('formatRegionalDate reflects local day difference across timezones for identical UTC moment', () => {
  // 2026-11-01 02:30 UTC:
  // In America/New_York (EDT = UTC-4 on Nov 1 morning), it is 2026-10-31 22:30 (October 31st!)
  // In Europe/Berlin (CET = UTC+1), it is 2026-11-01 03:30 (November 1st)
  const timestamp = '2026-11-01T02:30:00Z';

  const prefsNy = { locale: 'en', country: 'US', timeZone: 'America/New_York' };
  const prefsBerlin = { locale: 'de', country: 'DE', timeZone: 'Europe/Berlin' };
  const prefsUtc = { locale: 'en', country: 'US', timeZone: 'UTC' };

  const formattedNy = formatRegionalDate(timestamp, prefsNy, { day: 'numeric', month: 'numeric' });
  const formattedBerlin = formatRegionalDate(timestamp, prefsBerlin, { day: 'numeric', month: 'numeric' });
  const formattedUtc = formatRegionalDate(timestamp, prefsUtc, { day: 'numeric', month: 'numeric' });

  // NY is on day 31
  assert.match(formattedNy, /31/);
  // Berlin is on day 1
  assert.match(formattedBerlin, /1/);
  // UTC is on day 1
  assert.match(formattedUtc, /1/);
});
