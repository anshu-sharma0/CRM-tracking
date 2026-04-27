import { Types } from "mongoose";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { LeadModel } from "@/models/Lead";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid lead id." }, { status: 400 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const updates = {
    ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
    ...(body.phone !== undefined ? { phone: String(body.phone).trim() } : {}),
    ...(body.city !== undefined ? { city: String(body.city).trim() } : {}),
    ...(body.type !== undefined ? { type: String(body.type).trim() } : {}),
    ...(body.requirement !== undefined
      ? { requirement: String(body.requirement).trim() }
      : {}),
    ...(body.source !== undefined ? { source: String(body.source).trim() } : {}),
    ...(body.notes !== undefined ? { notes: String(body.notes).trim() } : {}),
    ...(body.status !== undefined ? { status: String(body.status).trim() } : {}),
    ...(body.budget !== undefined ? { budget: Number(body.budget) } : {}),
    ...(body.nextFollowUp !== undefined
      ? {
          nextFollowUp: body.nextFollowUp ? new Date(String(body.nextFollowUp)) : null,
        }
      : {}),
    ...(body.lastContact !== undefined
      ? {
          lastContact: body.lastContact ? new Date(String(body.lastContact)) : null,
        }
      : {}),
  };

  await connectToDatabase();

  const lead = await LeadModel.findByIdAndUpdate(
    id,
    updates,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  return NextResponse.json({
    lead: {
      _id: lead._id.toString(),
    },
  });
}
