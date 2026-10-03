import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server';
import { OsError } from '../os/errors.ts';
import type { InterestRecord } from './types.ts';

export async function reserveInterestRequest(input: {
  ipHash: string;
  emailHash: string;
  key: string;
  payloadHash: string;
}): Promise<'new' | 'replay'> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new OsError('unavailable', 'Banco de dados indisponível.');
  }

  const { data, error } = await adminClient.rpc('interest_reserve_request', {
    p_ip_hash: input.ipHash,
    p_email_hash: input.emailHash,
    p_key: input.key,
    p_payload_hash: input.payloadHash,
  });

  if (error) {
    const msg = error.message || '';
    if (msg.includes('Conflito')) {
      throw new OsError('conflict', 'Chave de idempotência já utilizada com outros dados.');
    }
    if (msg.includes('Limite')) {
      throw new OsError('limited', 'Muitas solicitações. Tente novamente mais tarde.');
    }
    throw new OsError('invalid', msg || 'Falha ao reservar solicitação.');
  }

  const result = data as { status?: string } | null;
  if (result?.status === 'replay') {
    return 'replay';
  }

  return 'new';
}

export async function saveInterestRecord(input: {
  key: string;
  payloadHash: string;
  record: Record<string, unknown>;
}): Promise<void> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new OsError('unavailable', 'Banco de dados indisponível.');
  }

  const { error } = await adminClient.rpc('interest_save', {
    p_key: input.key,
    p_payload_hash: input.payloadHash,
    p_record: input.record,
  });

  if (error) {
    throw new OsError('invalid', error.message || 'Falha ao salvar manifestação de interesse.');
  }
}

export async function listInterests(): Promise<InterestRecord[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new OsError('unavailable', 'Serviço indisponível.');
  }

  const { data, error } = await supabase.rpc('interest_list');

  if (error) {
    throw new OsError('forbidden', 'Acesso não autorizado para consulta de interesses.');
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    whatsapp: String(row.whatsapp),
    journey: row.journey as 'business' | 'professional',
    interest: row.interest as 'solutions' | 'education' | 'community',
    message: String(row.message || ''),
    marketingConsent: Boolean(row.marketing_consent),
    noticeVersion: String(row.notice_version),
    source: row.source as 'home-contact' | 'education' | 'community' | 'platform',
    createdAt: String(row.created_at),
  }));
}
