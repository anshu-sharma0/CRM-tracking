import { PaymentBadge, StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDealsOverview } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DealsPage() {
  const { deals, totalRevenue } = await getDealsOverview();

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <p className="text-sm font-medium text-sky-600">Revenue board</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Won clients and payment tracking
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Keep a clean view of converted clients, deal values, and payment progress.
            </p>
          </div>
          <div className="rounded-[2rem] bg-slate-950 px-5 py-4 text-white">
            <p className="text-sm text-slate-300">Total revenue</p>
            <p className="mt-1 text-3xl font-semibold">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {deals.length ? (
          deals.map((deal) => (
            <Card key={deal._id} className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <StatusBadge status="Won" />
                    <PaymentBadge status={deal.paymentStatus} />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {deal.lead?.name || "Unknown lead"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {deal.lead?.type || "Unknown business"} in {deal.lead?.city || "Unknown city"}
                  </p>
                </div>
                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                  <Info label="Deal Value" value={formatCurrency(deal.value)} />
                  <Info label="Created" value={formatDate(deal.createdAt)} />
                  <Info label="Phone" value={deal.lead?.phone || "Unavailable"} />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-sm text-slate-500">
              No deals created yet. Mark a lead as won and save proposal details to grow this page.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-slate-700">{value}</p>
    </div>
  );
}
