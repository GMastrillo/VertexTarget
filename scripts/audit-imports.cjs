// Catches case-sensitivity/path mismatches that break Linux (Vercel) builds but not Windows.
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const gitFiles = new Set(execSync("git ls-files src").toString().trim().split(/\r?\n/).map(f => f.split(path.sep).join("/")));
function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

let bad = 0;
for (const file of walk("src")) {
  if (!/\.(ts|tsx)$/.test(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(/from\s+["']@\/([^"']+)["']/g)) {
    const rel = "src/" + m[1];
    const candidates = [rel, rel + ".ts", rel + ".tsx", rel + "/index.ts", rel + "/index.tsx"];
    if (!candidates.some(c => gitFiles.has(c))) {
      console.log("SUSPEITO:", file, "→", m[1]);
      bad++;
    }
  }
}
console.log(bad === 0 ? "OK: todos os imports @/ casam com o case do git index" : `${bad} problema(s) encontrado(s)`);
