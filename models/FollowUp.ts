import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const followUpSchema = new Schema(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
    nextDate: Date,
  },
  {
    timestamps: true,
  },
);

export type FollowUpDocument = InferSchemaType<typeof followUpSchema> & {
  _id: string;
};

export const FollowUpModel =
  (models.FollowUp as Model<FollowUpDocument>) ||
  model("FollowUp", followUpSchema);
