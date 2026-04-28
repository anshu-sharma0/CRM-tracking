"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Loader2, PencilLine, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button, buttonStyles } from "@/components/ui/button";

export function LeadRowActions({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      "Delete this lead? This will also remove its related follow-ups and deal.",
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete lead.");
      }

      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Link
        href={`/leads/${leadId}`}
        className={buttonStyles({ variant: "secondary", size: "sm" })}
      >
        <Eye className="h-4 w-4" />
      </Link>
      <Link
        href={`/leads/${leadId}/edit`}
        className={buttonStyles({ variant: "secondary", size: "sm" })}
      >
        <PencilLine className="h-4 w-4" />
      </Link>
      <Button
        type="button"
        size="sm"
        variant="danger"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}