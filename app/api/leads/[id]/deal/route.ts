import { Types } from "mongoose";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { DealModel } from "@/models/Deal";
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

  const body = (await request.json()) as {
    value?: number;
    paymentStatus?: string;
  };

  if (body.value === undefined || Number(body.value) < 0) {
    return NextResponse.json({ error: "Deal value is required." }, { status: 400 });
  }

  await connectToDatabase();

  const deal = await DealModel.findOneAndUpdate(
    { leadId: id },
    {
      value: Number(body.value),
      paymentStatus: body.paymentStatus || "Not started",
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  await LeadModel.findByIdAndUpdate(id, {
    status: "Won",
  });

  return NextResponse.json({
    deal: {
      _id: deal._id.toString(),
    },
  });
}
