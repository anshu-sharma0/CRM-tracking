import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { DealModel } from "@/models/Deal";
import { FollowUpModel } from "@/models/FollowUp";
import { LeadModel } from "@/models/Lead";

type SearchParamsValue = string | string[] | undefined;

function getSingleValue(value: SearchParamsValue) {
  return Array.isArray(value) ? value[0] : value;
}

export async function getDashboardStats() {
  await connectToDatabase();

  const [totalLeads, activeLeads, wonDeals, lostLeads, revenueAgg] =
    await Promise.all([
      LeadModel.countDocuments(),
      LeadModel.countDocuments({
        status: { $nin: ["Won", "Lost"] },
      }),
      LeadModel.countDocuments({ status: "Won" }),
      LeadModel.countDocuments({ status: "Lost" }),
      DealModel.aggregate<{ totalRevenue: number }>([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$value" },
          },
        },
      ]),
    ]);

  return {
    totalLeads,
    activeLeads,
    wonDeals,
    lostLeads,
    totalRevenue: revenueAgg[0]?.totalRevenue ?? 0,
  };
}

export async function getLeads(searchParams?: Record<string, SearchParamsValue>) {
  await connectToDatabase();

  const search = getSingleValue(searchParams?.search)?.trim();
  const status = getSingleValue(searchParams?.status)?.trim();
  const sort = getSingleValue(searchParams?.sort)?.trim();

  const query: Record<string, unknown> = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { type: { $regex: search, $options: "i" } },
      { source: { $regex: search, $options: "i" } },
    ];
  }

  if (status && status !== "All") {
    query.status = status;
  }

  const sortOrder =
    sort === "desc"
      ? { nextFollowUp: -1 as const, createdAt: -1 as const }
      : { nextFollowUp: 1 as const, createdAt: -1 as const };

  const leads = await LeadModel.find(query).sort(sortOrder).lean();

  return leads.map((lead) => ({
    ...lead,
    _id: lead._id.toString(),
  }));
}

export async function getLeadById(id: string) {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const lead = await LeadModel.findById(id).lean();

  if (!lead) {
    return null;
  }

  return {
    ...lead,
    _id: lead._id.toString(),
  };
}

export async function getLeadDetails(id: string) {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const [lead, followUps, deal] = await Promise.all([
    LeadModel.findById(id).lean(),
    FollowUpModel.find({ leadId: id }).sort({ createdAt: -1 }).lean(),
    DealModel.findOne({ leadId: id }).lean(),
  ]);

  if (!lead) {
    return null;
  }

  return {
    lead: {
      ...lead,
      _id: lead._id.toString(),
    },
    followUps: followUps.map((followUp) => ({
      ...followUp,
      _id: followUp._id.toString(),
      leadId: followUp.leadId.toString(),
    })),
    deal: deal
      ? {
          ...deal,
          _id: deal._id.toString(),
          leadId: deal.leadId.toString(),
        }
      : null,
  };
}

export async function getUpcomingFollowUps() {
  await connectToDatabase();

  const leads = await LeadModel.find({
    status: { $nin: ["Won", "Lost"] },
    nextFollowUp: { $ne: null },
  })
    .sort({ nextFollowUp: 1 })
    .limit(20)
    .lean();

  return leads.map((lead) => ({
    ...lead,
    _id: lead._id.toString(),
  }));
}

export async function getDealsOverview() {
  await connectToDatabase();

  const deals = await DealModel.find()
    .sort({ createdAt: -1 })
    .populate("leadId")
    .lean();

  const totalRevenue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  return {
    totalRevenue,
    deals: deals.map((deal) => {
      const populatedLead = deal.leadId as unknown as
        | {
            _id: Types.ObjectId;
            name: string;
            type: string;
            city: string;
            phone: string;
          }
        | undefined;

      return {
        _id: deal._id.toString(),
        value: deal.value,
        paymentStatus: deal.paymentStatus,
        createdAt: deal.createdAt,
        lead: populatedLead
          ? {
              _id: populatedLead._id.toString(),
              name: populatedLead.name,
              type: populatedLead.type,
              city: populatedLead.city,
              phone: populatedLead.phone,
            }
          : null,
      };
    }),
  };
}
