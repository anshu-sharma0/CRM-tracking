import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, CircleDollarSign, FilePenLine, PhoneCall } from "lucide-react";

import { DealForm } from "@/components/leads/deal-form";
import { FollowUpModal } from "@/components/leads/follow-up-modal";
import { LeadStatusForm } from "@/components/leads/lead-status-form";
import { Badge, PaymentBadge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLeadDetails } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const details = await getLeadDetails(id);

  if (!details) {
    notFound();
  }

  const { lead, followUps, deal } = details;

  return (
    <div className="space-y-6">
      <Card className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <StatusBadge status={lead.status} />
              <Badge>{lead.source}</Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {lead.name}
            </h1>
            <p className="mt-2 text-slate-500">
              {lead.type} in {lead.city}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <FollowUpModal leadId={lead._id} />
            <Link
              href={`/leads/${lead._id}/edit`}
              className={buttonStyles({ variant: "secondary" })}
            >
              Edit lead
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={PhoneCall}
            label="Phone"
            value={lead.phone}
            hint="Primary outreach channel"
          />
          <MetricCard
            icon={CalendarClock}
            label="Next Follow-up"
            value={formatDate(lead.nextFollowUp)}
            hint="Latest scheduled action"
          />
          <MetricCard
            icon={FilePenLine}
            label="Last Contact"
            value={formatDate(lead.lastContact)}
            hint="Most recent interaction"
          />
          <MetricCard
            icon={CircleDollarSign}
            label="Expected Budget"
            value={formatCurrency(lead.budget)}
            hint="Current commercial estimate"
          />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="space-y-6">
          <Card className="space-y-4">
            <div>
              <p className="text-sm font-medium text-sky-600">Requirement</p>
              <h2 className="text-xl font-semibold text-slate-900">
                What this lead needs
              </h2>
            </div>
            <p className="text-sm leading-7 text-slate-600">{lead.requirement}</p>
          </Card>

          <Card className="space-y-4">
            <div>
              <p className="text-sm font-medium text-sky-600">Notes</p>
              <h2 className="text-xl font-semibold text-slate-900">
                Conversation context
              </h2>
            </div>
            <p className="text-sm leading-7 text-slate-600">
              {lead.notes || "No notes added yet for this lead."}
            </p>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sky-600">Follow-up history</p>
                <h2 className="text-xl font-semibold text-slate-900">
                  Timeline
                </h2>
              </div>
              <Badge tone="warning">{followUps.length} notes</Badge>
            </div>
            <div className="space-y-3">
              {followUps.length ? (
                followUps.map((followUp) => (
                  <div
                    key={followUp._id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <p className="text-sm leading-7 text-slate-700">{followUp.note}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>Logged {formatDate(followUp.createdAt)}</span>
                      <span>Next date: {formatDate(followUp.nextDate)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-500">
                  No follow-up notes yet. Use the modal above to log the next touchpoint.
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div>
              <p className="text-sm font-medium text-sky-600">Pipeline control</p>
              <h2 className="text-xl font-semibold text-slate-900">
                Update status
              </h2>
            </div>
            <LeadStatusForm leadId={lead._id} status={lead.status} />
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-sky-600">Proposal details</p>
                <h2 className="text-xl font-semibold text-slate-900">
                  Deal and payment tracking
                </h2>
              </div>
              {deal ? <PaymentBadge status={deal.paymentStatus} /> : null}
            </div>
            {deal ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                <p className="font-medium text-slate-900">
                  Proposal value: {formatCurrency(deal.value)}
                </p>
                <p className="mt-1">Created on {formatDate(deal.createdAt)}</p>
              </div>
            ) : null}
            <DealForm
              leadId={lead._id}
              initialValue={deal?.value}
              initialPaymentStatus={deal?.paymentStatus}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 inline-flex rounded-2xl bg-white p-3 text-slate-900 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </div>
  );
}
