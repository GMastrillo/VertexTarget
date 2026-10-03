import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { getOsConfig } from './config.ts';
import { OsError } from './errors.ts';
import type {
  OsContext,
  UsageKind,
  UsageReservation,
  OperationCompletion,
  UsageSummary,
} from './types.ts';

export async function reserveUsage(
  ctx: OsContext,
  input: {
    kind: UsageKind;
    key: string;
    payloadHash: string;
  }
): Promise<UsageReservation> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new OsError('unavailable', 'Serviço de banco de dados indisponível.');
  }

  const config = getOsConfig();
  const globalLimit = input.kind === 'copy' ? config.globalCopyLimit : config.globalSearchLimit;

  const { data, error } = await adminClient.rpc('os_reserve_usage', {
    p_user_id: ctx.userId,
    p_kind: input.kind,
    p_key: input.key,
    p_payload_hash: input.payloadHash,
    p_global_limit: globalLimit,
  });

  if (error) {
    const msg = error.message || '';
    if (msg.includes('Conflito')) {
      throw new OsError('conflict', 'Chave de operação já utilizada com parâmetros diferentes.');
    }
    if (msg.includes('Limite')) {
      throw new OsError('limited', msg);
    }
    throw new OsError('invalid', msg || 'Falha ao reservar quota de uso.');
  }

  const res = data as {
    operationId: string;
    state: 'reserved' | 'sent' | 'completed' | 'failed';
    executor: boolean;
  };

  return {
    operationId: res.operationId,
    state: res.state,
    executor: Boolean(res.executor),
  };
}

export async function markUsageSent(
  ctx: OsContext,
  operationId: string
): Promise<boolean> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new OsError('unavailable', 'Serviço de banco de dados indisponível.');
  }

  const { data, error } = await adminClient.rpc('os_mark_usage_sent', {
    p_user_id: ctx.userId,
    p_operation_id: operationId,
  });

  if (error) {
    throw new OsError('invalid', error.message || 'Falha ao marcar operação como enviada.');
  }

  return Boolean(data);
}

export async function completeUsage(
  ctx: OsContext,
  operationId: string,
  input: OperationCompletion
): Promise<void> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new OsError('unavailable', 'Serviço de banco de dados indisponível.');
  }

  const { error } = await adminClient.rpc('os_complete_usage', {
    p_user_id: ctx.userId,
    p_operation_id: operationId,
    p_result: input,
  });

  if (error) {
    throw new OsError('invalid', error.message || 'Falha ao finalizar registro de quota.');
  }
}

export async function releaseUnsentUsage(
  ctx: OsContext,
  operationId: string
): Promise<void> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new OsError('unavailable', 'Serviço de banco de dados indisponível.');
  }

  const { error } = await adminClient.rpc('os_release_unsent_usage', {
    p_user_id: ctx.userId,
    p_operation_id: operationId,
  });

  if (error) {
    throw new OsError('invalid', error.message || 'Falha ao liberar quota não enviada.');
  }
}

export async function getUsageSummary(ctx: OsContext): Promise<UsageSummary> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new OsError('unavailable', 'Serviço de banco de dados indisponível.');
  }

  const { data, error } = await adminClient.rpc('os_get_usage', {
    p_user_id: ctx.userId,
  });

  if (error || !data) {
    throw new OsError('invalid', error?.message || 'Falha ao obter extrato de uso.');
  }

  return data as UsageSummary;
}
