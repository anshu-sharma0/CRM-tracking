import { Types } from "mongoose";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { FollowUpModel } from "@/models/FollowUp";
import { LeadModel } from "@/models/Lead";

export async function POST(
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

  const body = (await request.json()) as { note?: string; nextDate?: string };
  const note = String(body.note || "").trim();

  if (!note) {
    return NextResponse.json({ error: "Follow-up note is required." }, { status: 400 });
  }

  await connectToDatabase();

  const followUp = await FollowUpModel.create({
    leadId: id,
    note,
    nextDate: body.nextDate ? new Date(body.nextDate) : undefined,
  });

  await LeadModel.findByIdAndUpdate(id, {
    lastContact: new Date(),
    ...(body.nextDate ? { nextFollowUp: new Date(body.nextDate) } : {}),
  });

  return NextResponse.json({
    followUp: {
      _id: followUp._id.toString(),
    },
  });
}
