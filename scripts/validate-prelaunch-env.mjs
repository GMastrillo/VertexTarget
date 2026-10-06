#!/usr/bin/env node

/**
 * scripts/validate-prelaunch-env.mjs
 * 
 * Script de auditoria e validação de variáveis de ambiente para pré-lançamento
 * do VertexTarget e Vertex OS.
 * 
 * Uso:
 *   node scripts/validate-prelaunch-env.mjs [--strict]
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Carrega arquivos .env em cascata compativel com Next.js (.env seguido por .env.local)
if (typeof process.loadEnvFile === 'function') {
  const envFiles = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '.env.local'),
  ];

  for (const envPath of envFiles) {
    if (existsSync(envPath)) {
      try {
        process.loadEnvFile(envPath);
      } catch {
        // Ignora erros de parsing pontuais e continua
      }
    }
  }
}

const isStrict = process.argv.includes('--strict') || process.env.NODE_ENV === 'production';

const checks = [
  // --- 1. Supabase (Crítico) ---
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    category: 'CRÍTICA',
    description: 'Endpoint REST/Auth do Supabase',
    validate: (val) => {
      if (!val) return { ok: false, message: 'Não configurada' };
      if (val.includes('your-project')) return { ok: false, message: 'Valor padrão/placeholder não alterado' };
      if (!val.startsWith('https://') && !val.startsWith('http://127.0.0.1') && !val.startsWith('http://localhost')) {
        return { ok: false, message: 'URL deve iniciar com https://' };
      }
      return { ok: true };
    },
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    category: 'CRÍTICA',
    description: 'Chave pública (anon/publishable) do Supabase',
    validate: (val) => {
      const pubKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || val;
      if (!pubKey) return { ok: false, message: 'Nem ANON nem PUBLISHABLE configuradas' };
      if (pubKey.includes('your_') || pubKey.includes('your-key')) return { ok: false, message: 'Placeholder não alterado' };
      return { ok: true };
    },
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    category: 'CRÍTICA',
    description: 'Chave com privilégio de serviço (exclusiva do servidor)',
    validate: (val) => {
      if (!val) return { ok: false, message: 'Não configurada (bloqueia mutações seguras da OS)' };
      if (val.includes('your_') || val.includes('your-key')) return { ok: false, message: 'Placeholder não alterado' };
      return { ok: true };
    },
  },
  // --- 2. Criptografia & Segurança da OS (Crítico) ---
  {
    key: 'AUTH_RECOVERY_SECRET',
    category: 'CRÍTICA',
    description: 'Segredo HMAC para recuperação de senha com prova criptográfica',
    validate: (val) => {
      if (!val) return { ok: false, message: 'Não configurada' };
      if (val.length < 32) return { ok: false, message: 'Deve ter no mínimo 32 caracteres para segurança HMAC' };
      if (val.includes('generate_')) return { ok: false, message: 'Placeholder não alterado' };
      return { ok: true };
    },
  },
  {
    key: 'REQUEST_LIMIT_SECRET',
    category: 'CRÍTICA',
    description: 'Segredo HMAC para anonimização de IP e rate limiting',
    validate: (val) => {
      if (!val) return { ok: false, message: 'Não configurada' };
      if (val.length < 32) return { ok: false, message: 'Deve ter no mínimo 32 caracteres para segurança HMAC' };
      if (val.includes('generate_')) return { ok: false, message: 'Placeholder não alterado' };
      return { ok: true };
    },
  },
  // --- 3. Inteligência Artificial (Importante) ---
  {
    key: 'GEMINI_API_KEY',
    category: 'IMPORTANTE',
    description: 'Chave Google Gemini para copy e busca assistida',
    validate: (val) => {
      const key = val || process.env.GOOGLE_GEMINI_API_KEY;
      if (!key) return { ok: false, message: 'Não configurada (recursos de IA ficarão desabilitados)' };
      if (key.includes('your_')) return { ok: false, message: 'Placeholder não alterado' };
      return { ok: true };
    },
  },
  // --- 4. Anti-Abuso / Captcha (Importante) ---
  {
    key: 'NEXT_PUBLIC_HCAPTCHA_SITE_KEY',
    category: 'IMPORTANTE',
    description: 'Site Key pública hCaptcha / Turnstile',
    validate: (val) => {
      if (!val) return { ok: false, message: 'Não configurada (formulários sem proteção ativa de bot)' };
      if (val.includes('your_')) return { ok: false, message: 'Placeholder não alterado' };
      return { ok: true };
    },
  },
  {
    key: 'HCAPTCHA_SECRET_KEY',
    category: 'IMPORTANTE',
    description: 'Chave secreta de validação hCaptcha / Turnstile',
    validate: (val) => {
      if (!val) return { ok: false, message: 'Não configurada' };
      if (val.includes('your_')) return { ok: false, message: 'Placeholder não alterado' };
      return { ok: true };
    },
  },
  // --- 5. Domínio e URL da Aplicação ---
  {
    key: 'APP_URL',
    category: 'IMPORTANTE',
    description: 'URL canônica da aplicação em produção',
    validate: (val) => {
      const url = val || process.env.NEXT_PUBLIC_APP_URL;
      if (!url) return { ok: false, message: 'Não configurada' };
      if (isStrict && (url.includes('localhost') || url.includes('127.0.0.1'))) {
        return { ok: false, message: 'Em produção deve apontar para o domínio oficial HTTPS' };
      }
      return { ok: true };
    },
  },
  // --- 6. Complementares / Opcionais ---
  {
    key: 'NEXT_PUBLIC_WHATSAPP_NUMBER',
    category: 'OPCIONAL',
    description: 'Número de WhatsApp de atendimento comercial (com DDI 55)',
    validate: (val) => {
      if (!val) return { ok: true, message: 'Não configurado (usa fallback estático)' };
      if (!val.startsWith('55') || val.length < 12) {
        return { ok: false, message: 'Formato recomendado: 55 + DDD + 9 dígitos (ex: 5511999999999)' };
      }
      return { ok: true };
    },
  },
  {
    key: 'TRUSTED_PROXY',
    category: 'OPCIONAL',
    description: 'Proxy confiável para cabeçalhos de IP (vercel, cloudflare ou none)',
    validate: (val) => {
      if (!val || val === 'none') return { ok: true, message: 'Padrão (none)' };
      if (val === 'vercel' || val === 'cloudflare') return { ok: true };
      return { ok: false, message: 'Valores válidos: vercel, cloudflare, none' };
    },
  },
];

console.log('\n=============================================================');
console.log('  🔍 VertexTarget & Vertex OS — Auditoria de Pré-Lançamento');
console.log(`  Modo: ${isStrict ? 'PRODUÇÃO ESTRITA' : 'DESENVOLVIMENTO'}`);
console.log('=============================================================\n');

let criticalErrors = 0;
let warnings = 0;

for (const item of checks) {
  const value = process.env[item.key];
  const result = item.validate(value);

  if (result.ok) {
    const note = result.message ? ` (${result.message})` : '';
    console.log(`  ✅ [${item.category}] ${item.key}: OK${note}`);
  } else {
    if (item.category === 'CRÍTICA') {
      criticalErrors++;
      console.log(`  ❌ [${item.category}] ${item.key}: ${result.message}`);
    } else if (item.category === 'IMPORTANTE') {
      warnings++;
      console.log(`  ⚠️  [${item.category}] ${item.key}: ${result.message}`);
    } else {
      console.log(`  ℹ️  [${item.category}] ${item.key}: ${result.message}`);
    }
  }
}

console.log('\n-------------------------------------------------------------');
console.log(`  Resumo: ${criticalErrors} erros críticos | ${warnings} alertas importantes`);
console.log('-------------------------------------------------------------\n');

if (criticalErrors > 0 && isStrict) {
  console.error('⛔ FALHA: Existem variáveis críticas não configuradas para produção.\n');
  process.exit(1);
} else {
  console.log('✨ Auditoria concluída. Siga as orientações em docs/deploy/pre-launch-production-guide.md\n');
  process.exit(0);
}
