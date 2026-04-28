import { notFound } from "next/navigation";

import { LeadForm } from "@/components/leads/lead-form";
import { leadSources, type LeadSource, type LeadStatus } from "@/lib/constants";
import { getLeadById } from "@/lib/data";
import { formatDateForInput } from "@/lib/utils";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return <LeadForm mode="edit" leadId={id} initialValues={mapLeadValues(lead)} />;
}

function mapLeadValues(lead: {
  name: string;
  phone: string;
  city: string;
  type: string;
  requirement: string;
  source: string;
  budget: number;
  notes?: string;
  status: LeadStatus;
  nextFollowUp?: Date | string | null;
  lastContact?: Date | string | null;
}) {
  return {
    ...lead,
    source: leadSources.includes(lead.source as LeadSource)
      ? (lead.source as LeadSource)
      : "Other",
    notes: lead.notes || "",
    nextFollowUp: formatDateForInput(lead.nextFollowUp),
    lastContact: formatDateForInput(lead.lastContact),
  };
}
