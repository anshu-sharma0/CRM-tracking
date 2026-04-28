"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { CreatableSelect } from "@/components/ui/creatable-select";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  businessCategories,
  leadSources,
  leadStatuses,
  type LeadSource,
  type LeadStatus,
} from "@/lib/constants";
import { formatDateForInput } from "@/lib/utils";

type LeadFormValues = {
  name: string;
  phone: string;
  city: string;
  type: string;
  requirement: string;
  source: LeadSource;
  budget: number;
  notes: string;
  status?: LeadStatus;
  nextFollowUp?: string;
  lastContact?: string;
};

export function LeadForm({
  mode,
  initialValues,
  leadId,
}: {
  mode: "create" | "edit";
  initialValues?: Partial<LeadFormValues>;
  leadId?: string;
}) {
  const router = useRouter();
  const today = formatDateForInput(new Date());
  const [values, setValues] = useState<LeadFormValues>({
    name: initialValues?.name || "",
    phone: initialValues?.phone || "",
    city: initialValues?.city || "",
    type: initialValues?.type || "",
    requirement: initialValues?.requirement || "",
    source: initialValues?.source || "Instagram",
    budget: initialValues?.budget || 0,
    notes: initialValues?.notes || "",
    status: initialValues?.status || "New",
    nextFollowUp: initialValues?.nextFollowUp || today,
    lastContact: initialValues?.lastContact || today,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange<K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!values.type.trim()) {
      setError("Business type is required.");
      return;
    }

    setIsSubmitting(true);

    const endpoint = mode === "create" ? "/api/leads" : `/api/leads/${leadId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = (await response.json().catch(() => null)) as
      | { error?: string; lead?: { _id: string } }
      | null;

    setIsSubmitting(false);

    if (!response.ok) {
      setError(data?.error || "Unable to save the lead.");
      return;
    }

    startTransition(() => {
      router.push(mode === "create" ? `/leads/${data?.lead?._id}` : `/leads/${leadId}`);
      router.refresh();
    });
  }

  return (
    <FormWrapper
      title={mode === "create" ? "Add a new lead" : "Edit lead"}
      description="Capture business details, outreach context, and the next sales action."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Business Name">
            <Input
              value={values.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="Acme Dental Studio"
              required
            />
          </Field>
          <Field label="Phone">
            <Input
              value={values.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              type="tel"
              placeholder="+1 555 010 8899"
              required
            />
          </Field>
          <Field label="City">
            <Input
              value={values.city}
              onChange={(event) => handleChange("city", event.target.value)}
              placeholder="Austin"
              required
            />
          </Field>
          <Field label="Business Type">
            <CreatableSelect
              value={values.type}
              onChange={(type) => handleChange("type", type)}
              options={businessCategories.map((category) => category)}
              placeholder="Select or add a business category"
              searchPlaceholder="Search or type a new category"
              addButtonLabel="Add"
            />
          </Field>
          <Field label="Source">
            <Select
              value={values.source}
              onChange={(event) => handleChange("source", event.target.value as LeadSource)}
            >
              {leadSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Expected Budget">
            <Input
              min={0}
              type="number"
              value={values.budget}
              onChange={(event) => handleChange("budget", Number(event.target.value))}
              required
            />
          </Field>
          <Field label="Pipeline Status">
            <Select
              value={values.status}
              onChange={(event) => handleChange("status", event.target.value as LeadStatus)}
            >
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Next Follow-up Date">
            <Input
              type="date"
              value={values.nextFollowUp}
              onChange={(event) => handleChange("nextFollowUp", event.target.value)}
            />
          </Field>
          <Field label="Last Contact Date">
            <Input
              type="date"
              value={values.lastContact}
              onChange={(event) => handleChange("lastContact", event.target.value)}
            />
          </Field>
        </div>

        <Field label="Requirement">
          <Textarea
            value={values.requirement}
            onChange={(event) => handleChange("requirement", event.target.value)}
            placeholder="Landing page redesign and lead capture automation"
            required
          />
        </Field>

        <Field label="Notes">
          <Textarea
            value={values.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            placeholder="Shared pricing concern. Wants WhatsApp-first communication."
          />
        </Field>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : mode === "create" ? (
              "Create lead"
            ) : (
              "Update lead"
            )}
          </Button>
        </div>
      </form>
    </FormWrapper>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}
