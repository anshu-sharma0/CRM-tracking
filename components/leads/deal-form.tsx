"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { paymentStatuses, type PaymentStatus } from "@/lib/constants";

export function DealForm({
  leadId,
  initialValue,
  initialPaymentStatus,
}: {
  leadId: string;
  initialValue?: number;
  initialPaymentStatus?: PaymentStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue || 0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    initialPaymentStatus || "Not started",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    await fetch(`/api/leads/${leadId}/deal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value, paymentStatus }),
    });

    setIsSubmitting(false);

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Proposal / deal value</span>
        <Input
          type="number"
          min={0}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          required
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Payment status</span>
        <Select
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
        >
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
      </label>
      <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Saving deal
          </>
        ) : (
          "Save proposal details"
        )}
      </Button>
    </form>
  );
}
