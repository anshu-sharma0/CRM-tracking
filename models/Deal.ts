import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

import { paymentStatuses, type PaymentStatus } from "@/lib/constants";

const dealSchema = new Schema(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: paymentStatuses satisfies readonly PaymentStatus[],
      default: "Not started",
    },
  },
  {
    timestamps: true,
  },
);

export type DealDocument = InferSchemaType<typeof dealSchema> & {
  _id: string;
};

export const DealModel =
  (models.Deal as Model<DealDocument>) || model("Deal", dealSchema);
