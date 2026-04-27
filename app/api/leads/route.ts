import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { LeadModel } from "@/models/Lead";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const payload = {
    name: String(body.name || "").trim(),
    phone: String(body.phone || "").trim(),
    city: String(body.city || "").trim(),
    type: String(body.type || "").trim(),
    requirement: String(body.requirement || "").trim(),
    source: String(body.source || "").trim(),
    budget: Number(body.budget || 0),
    notes: String(body.notes || "").trim(),
    status: String(body.status || "New").trim(),
    nextFollowUp: body.nextFollowUp ? new Date(String(body.nextFollowUp)) : undefined,
    lastContact: body.lastContact ? new Date(String(body.lastContact)) : undefined,
  };

  if (
    !payload.name ||
    !payload.phone ||
    !payload.city ||
    !payload.type ||
    !payload.requirement ||
    !payload.source
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  await connectToDatabase();

  const lead = await LeadModel.create(payload);

  return NextResponse.json({
    lead: {
      _id: lead._id.toString(),
    },
  });
}
