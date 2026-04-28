import { BadgeDollarSign, BriefcaseBusiness, CircleCheckBig, OctagonX } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { getDashboardStats, getUpcomingFollowUps } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [stats, followUps] = await Promise.all([
    getDashboardStats(),
    getUpcomingFollowUps(),
  ]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Leads"
          value={stats.totalLeads}
          hint="All businesses currently tracked in your CRM."
          icon={BriefcaseBusiness}
        />
        <StatCard
          label="Active Leads"
          value={stats.activeLeads}
          hint="Open conversations still moving through your pipeline."
          icon={BadgeDollarSign}
        />
        <StatCard
          label="Won Deals"
          value={stats.wonDeals}
          hint="Clients converted from outreach into paid work."
          icon={CircleCheckBig}
        />
        <StatCard
          label="Lost Leads"
          value={stats.lostLeads}
          hint="Leads that dropped out or were marked as closed-lost."
          icon={OctagonX}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <Card className="space-y-4">
          <div>
            <p className="text-sm font-medium text-sky-600">Upcoming follow-ups</p>
            <h3 className="text-2xl font-semibold text-slate-900">
              Next actions
            </h3>
          </div>
          <div className="space-y-3">
            {followUps.length ? (
              followUps.map((lead) => (
                <div
                  key={lead._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <p className="font-medium text-slate-900">{lead.name}</p>
                  <p className="text-sm text-slate-500">
                    {lead.type} in {lead.city}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Follow up on {formatDate(lead.nextFollowUp)}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-500">
                No follow-ups scheduled yet. Add your first lead to start the pipeline.
              </p>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
