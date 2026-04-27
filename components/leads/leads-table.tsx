import Link from "next/link";
import { ArrowUpDown, Search } from "lucide-react";

import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableEmptyState,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { leadStatuses, type LeadStatus } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

type LeadRow = {
  _id: string;
  name: string;
  type: string;
  phone: string;
  city: string;
  source: string;
  requirement: string;
  budget: number;
  status: LeadStatus;
  nextFollowUp?: Date | string | null;
  lastContact?: Date | string | null;
};

export function LeadsTable({
  leads,
  search,
  status,
  sort,
}: {
  leads: LeadRow[];
  search?: string;
  status?: string;
  sort?: string;
}) {
  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-600">Lead pipeline</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Manage outreach and follow-ups
            </h1>
          </div>
          <Link href="/leads/new" className={buttonStyles({})}>
            Add Lead
          </Link>
        </div>
        <form className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              defaultValue={search || ""}
              name="search"
              placeholder="Search business, city, phone, source..."
              className="pl-10"
            />
          </label>
          <Select defaultValue={status || "All"} name="status">
            <option value="All">All statuses</option>
            {leadStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select defaultValue={sort || "asc"} name="sort">
            <option value="asc">Follow-up: earliest first</option>
            <option value="desc">Follow-up: latest first</option>
          </Select>
          <Button variant="secondary" type="submit">
            <ArrowUpDown className="h-4 w-4" />
            Apply
          </Button>
        </form>
      </Card>

      <div className="hidden xl:block">
        {leads.length ? (
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Business</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Phone</TableHeaderCell>
                <TableHeaderCell>City</TableHeaderCell>
                <TableHeaderCell>Source</TableHeaderCell>
                <TableHeaderCell>Requirement</TableHeaderCell>
                <TableHeaderCell>Budget</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
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
                  <TableCell>{lead.type}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.city}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell className="max-w-56">{lead.requirement}</TableCell>
                  <TableCell>{formatCurrency(lead.budget)}</TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>{formatDate(lead.nextFollowUp)}</TableCell>
                  <TableCell>{formatDate(lead.lastContact)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <TableEmptyState>No leads match the current filters.</TableEmptyState>
        )}
      </div>

      <div className="grid gap-4 xl:hidden">
        {leads.length ? (
          leads.map((lead) => (
            <Card key={lead._id} className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/leads/${lead._id}`}
                    className="text-lg font-semibold text-slate-900 hover:text-sky-600"
                  >
                    {lead.name}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {lead.type} in {lead.city}
                  </p>
                </div>
                <StatusBadge status={lead.status} />
              </div>
              <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <InfoLine label="Phone" value={lead.phone} />
                <InfoLine label="Source" value={lead.source} />
                <InfoLine label="Budget" value={formatCurrency(lead.budget)} />
                <InfoLine label="Follow-up" value={formatDate(lead.nextFollowUp)} />
              </div>
            </Card>
          ))
        ) : (
          <TableEmptyState>No leads match the current filters.</TableEmptyState>
        )}
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-slate-700">{value}</p>
    </div>
  );
}
