import { LeadsTable } from "@/components/leads/leads-table";
import { getLeads } from "@/lib/data";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const leads = await getLeads(params);

  return (
    <LeadsTable
      leads={leads}
      search={Array.isArray(params.search) ? params.search[0] : params.search}
      status={Array.isArray(params.status) ? params.status[0] : params.status}
      sort={Array.isArray(params.sort) ? params.sort[0] : params.sort}
    />
  );
}
