import Link from "next/link";

import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getUpcomingFollowUps } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function FollowUpsPage() {
  const leads = await getUpcomingFollowUps();

  return (
    <div className="space-y-6">
      <Card className="space-y-2">
        <p className="text-sm font-medium text-sky-600">Follow-up queue</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Stay ahead of every next touchpoint
        </h1>
        <p className="max-w-2xl text-sm text-slate-500">
          These are the leads with upcoming follow-up dates, sorted by urgency so
          you can work the queue each day without missing a warm prospect.
        </p>
      </Card>

      <div className="grid gap-4">
        {leads.length ? (
          leads.map((lead) => (
            <Link key={lead._id} href={`/leads/${lead._id}`}>
              <Card className="transition hover:-translate-y-0.5 hover:shadow-xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <StatusBadge status={lead.status} />
                      <Badge>{lead.source}</Badge>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900">{lead.name}</h2>
                    <p className="text-sm text-slate-500">
                      {lead.type} in {lead.city}
                    </p>
                  </div>
                  <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <Info label="Next Follow-up" value={formatDate(lead.nextFollowUp)} />
                    <Info label="Last Contact" value={formatDate(lead.lastContact)} />
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <p className="text-sm text-slate-500">
              No follow-ups are scheduled yet. Add a lead and assign a next date to populate this queue.
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
