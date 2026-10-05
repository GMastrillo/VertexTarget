# Guia Oficial de Pré-Lançamento, Segurança e SMTP — VertexTarget & Vertex OS

Este guia reúne os procedimentos obrigatórios para colocar o ecossistema VertexTarget e a plataforma Vertex OS em produção com total segurança, estabilidade e conformidade.

---

## 1. Auditoria Rápida de Ambiente

Antes de realizar o deploy, execute o validador nativo no terminal:

```bash
# Modo padrão (informativo para desenvolvimento)
npm run check:env

# Modo estrito para produção (retorna erro se variáveis críticas faltarem)
npm run check:env -- --strict
```

---

## 2. Configuração de Provedor SMTP no Supabase Auth

Por padrão, o Supabase utiliza um servidor SMTP compartilhado limitado a aproximadamente 3 a 4 e-mails por hora. **Para produção com cadastro público, é obrigatório conectar um SMTP transacional dedicado** (recomendamos [Resend](https://resend.com) ou SendGrid).

### Passo a Passo no Painel do Supabase:
1. Acesse o dashboard do seu projeto Supabase: `https://supabase.com/dashboard/project/SEU_PROJECT_ID`
2. No menu lateral esquerdo, vá em **Authentication** -> **SMTP Settings** (ou **Providers** -> **Email**).
3. Ative a opção **"Enable Custom SMTP"**.
4. Preencha as credenciais do seu provedor (exemplo com **Resend**):
   - **Sender email:** `contato@vertextarget.com.br` (ou `noreply@vertextarget.com.br`)
   - **Sender name:** `Vertex OS`
   - **Host:** `smtp.resend.com`
   - **Port:** `465` (com SSL/TLS) ou `587` (com STARTTLS)
   - **User:** `resend`
   - **Password:** `re_sua_chave_de_api_resend`
5. Clique em **Save changes**.

---

## 3. Templates de E-mail Personalizados (pt-BR)

No painel do Supabase, acesse **Authentication** -> **Email Templates** para customizar as mensagens enviadas aos usuários.

### 3.1 Confirmação de Cadastro (Confirm Signup)
- **Subject:** `Confirme sua conta no Vertex OS`
- **Body (HTML):**
```html
<div style="background-color: #05050a; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; text-align: center;">
  <div style="max-width: 480px; margin: 0 auto; background-color: #0b0b14; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 32px 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <div style="display: inline-block; padding: 6px 12px; background: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 9999px; color: #00f0ff; font-size: 11px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px;">
      Vertex OS
    </div>
    <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 12px 0;">Confirme seu e-mail</h1>
    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
      Bem-vindo ao Vertex OS. Para ativar o seu workspace gratuito e começar a criar ou gerenciar seus projetos, confirme seu endereço de e-mail clicando no botão abaixo:
    </p>
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #00f0ff; color: #000000; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">
      Confirmar Minha Conta
    </a>
    <p style="color: #64748b; font-size: 11px; margin-top: 24px; line-height: 1.5;">
      Se você não solicitou este cadastro, pode desconsiderar esta mensagem.
    </p>
  </div>
</div>
```

### 3.2 Recuperação de Senha (Reset Password)
- **Subject:** `Redefinição de senha — Vertex OS`
- **Body (HTML):**
```html
<div style="background-color: #05050a; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; text-align: center;">
  <div style="max-width: 480px; margin: 0 auto; background-color: #0b0b14; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 32px 24px;">
    <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">Redefinição de Senha</h1>
    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
      Recebemos um pedido para redefinir a senha de acesso ao seu workspace. Clique no link seguro abaixo para cadastrar uma nova senha:
    </p>
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #00f0ff; color: #000000; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">
      Cadastrar Nova Senha
    </a>
  </div>
</div>
```

---

## 4. Configuração de URLs e Redirecionamentos no Supabase

Em **Authentication** -> **URL Configuration**:
1. **Site URL:** Configure a URL canônica de produção:
   - `https://vertextarget.com.br`
2. **Redirect URLs:** Adicione os endpoints autorizados para callbacks:
   - `https://vertextarget.com.br/**`
   - `https://*.vercel.app/**` (para ambientes de staging/preview)
   - `http://localhost:3004/**` (apenas para desenvolvimento local)

---

## 5. Google Gemini & Proteção de Custos de IA

A Vertex OS utiliza o SDK `@google/genai` no servidor com o modelo `gemini-2.5-flash` / `gemini-3.8-flash` e Google Search Grounding.

1. **Obtenção da Chave:** Gere a chave em [Google AI Studio](https://aistudio.google.com/).
2. **Alertas de Faturamento no Google Cloud:**
   - Configure um teto de gastos e alerta por e-mail quando atingir 50%, 80% e 100% do orçamento (ex: R$ 100/mês).
3. **Freios Internos do Vertex OS:**
   - O Vertex OS possui travas atômicas via `OS_GLOBAL_COPY_LIMIT=1000` e `OS_GLOBAL_SEARCH_LIMIT=100` mensais, impedindo custos inesperados mesmo sob pico de uso.

---

## 6. Proteção Anti-Abuso (hCaptcha / Turnstile)

1. Cadastre o domínio `vertextarget.com.br` no painel do [hCaptcha](https://www.hcaptcha.com/) ou [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/).
2. Copie a **Site Key** pública para `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`.
3. Copie a **Secret Key** privada para `HCAPTCHA_SECRET_KEY` no ambiente do servidor.

---

## 7. Checklist Final de Lançamento

- [ ] Variáveis críticas validadas (`npm run check:env -- --strict`).
- [ ] SMTP próprio verificado com envio de e-mail de teste.
- [ ] Row Level Security (RLS) verificado (18 tabelas ativas no Supabase).
- [ ] Testes automatizados executados com sucesso:
  - `npm run test:os` (65 testes de unidade da OS)
  - `npm run test:commercial` (30 asserções comerciais)
  - `npm run build` (60 rotas estáticas e dinâmicas compiladas)
- [ ] Headers de segurança ativos (CSP, HSTS, X-Content-Type-Options, Referrer-Policy).
