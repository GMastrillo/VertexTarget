import { FinanceiroWorkspace } from "@/components/admin/FinanceiroWorkspace";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { listManualSales } from "@/lib/operations-repository";
import { getClients } from "@/lib/admin-repository";
import { getCommercialSnapshot } from "@/lib/commercial-repository";
import { getPaymentLinksData } from "@/lib/payment-link-repository";
import { getFinanceData } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const [finance, manualSales, user, paymentLinkData, clients, commercial] =
    await Promise.all([
      getFinanceData(),
      listManualSales(),
      getAuthenticatedTeamUser(),
      getPaymentLinksData(),
      getClients(),
      getCommercialSnapshot(),
    ]);

  const canManage = user?.role === "owner" || user?.role === "finance";

  return (
    <FinanceiroWorkspace
      finance={finance}
      manualSales={manualSales}
      canManage={canManage}
      paymentLinkData={paymentLinkData}
      clients={clients.map((c) => ({ id: c.id, name: c.name }))}
      deals={commercial.deals.map((d) => ({ id: d.id, name: d.title }))}
    />
  );
}
