import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function findFiles(dir, exts) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        results = results.concat(findFiles(full, exts));
      }
    } else if (exts.includes(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

test('UI stack contract: zero direct framer-motion imports in src', () => {
  const srcFiles = findFiles(path.resolve('src'), ['.ts', '.tsx', '.js', '.jsx']);
  const violations = [];

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    if (/from\s+['"]framer-motion['"]/.test(content)) {
      violations.push(path.relative(process.cwd(), file));
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found legacy framer-motion imports in:\n${violations.join('\n')}`
  );
});

test('UI stack contract: required shadcn primitives and utils exist', () => {
  const requiredFiles = [
    'src/lib/utils.ts',
    'src/components/ui/button.tsx',
    'src/components/ui/dialog.tsx',
    'src/components/ui/tabs.tsx',
    'src/components/ui/accordion.tsx',
  ];

  for (const relPath of requiredFiles) {
    const exists = fs.existsSync(path.resolve(relPath));
    assert.equal(exists, true, `Missing required UI contract file: ${relPath}`);
  }
});
