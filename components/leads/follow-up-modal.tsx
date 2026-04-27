"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";

export function FollowUpModal({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch(`/api/leads/${leadId}/follow-ups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note, nextDate }),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    setIsSubmitting(false);

    if (!response.ok) {
      setError(data?.error || "Unable to save the follow-up.");
      return;
    }

    setOpen(false);
    setNote("");
    setNextDate("");

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add follow-up
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add follow-up"
        description="Log the latest interaction and schedule the next action."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Follow-up note</span>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Shared proposal and scheduled walkthrough for Thursday."
              required
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Next follow-up date</span>
            <Input
              type="date"
              value={nextDate}
              onChange={(event) => setNextDate(event.target.value)}
            />
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                "Save follow-up"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
