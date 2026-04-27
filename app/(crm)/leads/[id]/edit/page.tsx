import { notFound } from "next/navigation";

import { LeadForm, mapLeadValues } from "@/components/leads/lead-form";
import { getLeadById } from "@/lib/data";

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
