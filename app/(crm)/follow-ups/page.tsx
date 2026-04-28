import Link from "next/link";

import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { getUpcomingFollowUps } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function FollowUpsPage() {
  const leads = await getUpcomingFollowUps();

  return (
    <ResponsiveTable
      eyebrow="Follow-up queue"
      title="Stay ahead of every next touchpoint"
      description="These are the leads with upcoming follow-up dates, sorted by urgency so you can work the queue each day without missing a warm prospect."
      hasData={leads.length > 0}
      desktopScrollClassName="max-h-[32rem] overflow-auto rounded-3xl border border-slate-200/80 bg-white"
      desktopContent={
        <Table>
          <TableHead className="sticky top-0 z-10">
            <tr>
              <TableHeaderCell>Lead</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Source</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>City</TableHeaderCell>
              <TableHeaderCell>Next Follow-up</TableHeaderCell>
              <TableHeaderCell>Last Contact</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell className="font-medium text-slate-900">
                  <Link href={`/leads/${lead._id}`} className="hover:text-sky-600">
                    {lead.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>{lead.type}</TableCell>
                <TableCell>{lead.city}</TableCell>
                <TableCell>{formatDate(lead.nextFollowUp)}</TableCell>
                <TableCell>{formatDate(lead.lastContact)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      mobileContent={leads.map((lead) => (
        <Link key={lead._id} href={`/leads/${lead._id}`}>
          <Card className="space-y-4 transition hover:-translate-y-0.5 hover:shadow-xl">
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
      ))}
      emptyState="No follow-ups are scheduled yet. Add a lead and assign a next date to populate this queue."
    />
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
