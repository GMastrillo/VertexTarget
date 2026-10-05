export type ManualSaleRecord = {
  amountMinor: number;
  soldAt: string;
};

export type ManualSourceResult = {
  manualSales: ManualSaleRecord[];
  coverage: "complete" | "error";
  errorCode?: string;
};

type MinimalSupabaseClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        order: (
          column: string,
          options: { ascending: boolean }
        ) => {
          range: (
            from: number,
            to: number
          ) => Promise<{
            data: Array<{ amount_cents?: number | null; sold_at?: string | null }> | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  };
};

const PAGE_SIZE = 500;

function extractRows(
  rows: Array<{ amount_cents?: number | null; sold_at?: string | null }>
): ManualSaleRecord[] {
  const result: ManualSaleRecord[] = [];
  for (const row of rows) {
    if (row.amount_cents != null && row.sold_at) {
      result.push({
        amountMinor: Number(row.amount_cents),
        soldAt: String(row.sold_at),
      });
    }
  }
  return result;
}

export async function fetchManualSource(input: {
  supabase: unknown;
  organizationId: string;
}): Promise<ManualSourceResult> {
  if (!input.supabase || !input.organizationId) {
    return { manualSales: [], coverage: "complete" };
  }

  const client = input.supabase as MinimalSupabaseClient;
  const sales: ManualSaleRecord[] = [];
  let from = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await client
        .from("manual_sales")
        .select("amount_cents,sold_at")
        .eq("organization_id", input.organizationId)
        .order("sold_at", { ascending: false })
        .range(from, to);

      if (error) {
        return { manualSales: [], coverage: "error", errorCode: error.message };
      }

      const rows = data ?? [];
      sales.push(...extractRows(rows));
      hasMore = rows.length >= PAGE_SIZE;
      from += PAGE_SIZE;
    }

    return { manualSales: sales, coverage: "complete" };
  } catch (err) {
    const errorObj = err as { message?: string };
    return {
      manualSales: [],
      coverage: "error",
      errorCode: errorObj.message ?? "manual_sales_error",
    };
  }
}
