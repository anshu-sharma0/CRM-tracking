import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

import { leadStatuses, type LeadStatus } from "@/lib/constants";

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    requirement: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: leadStatuses satisfies readonly LeadStatus[],
      default: "New",
    },
    nextFollowUp: Date,
    lastContact: Date,
  },
  {
    timestamps: true,
  },
);

export type LeadDocument = InferSchemaType<typeof leadSchema> & {
  _id: string;
};

export const LeadModel =
  (models.Lead as Model<LeadDocument>) || model("Lead", leadSchema);
