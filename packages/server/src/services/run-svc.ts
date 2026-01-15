import { Schema, model, Types } from "mongoose";
import { Run } from "../models/run";

const RunSchema = new Schema<Run>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    userId: { type: String, required: true, trim: true, ref: "User" },
    began: { type: Date, required: true },
    distanceKm: Number,
    duration: Number,
    dataLeft: { type: [Number], default: [] },
    avgLeft: Number,
    dataRight: { type: [Number], default: [] },
    avgRight: Number,
  },
  {
    collection: "truewalk_runs",
    timestamps: true,
  }
);

const RunModel = model<Run>("Run", RunSchema);

function ensureDate(value: unknown): Date | undefined {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return undefined;
}

function index(userId: string): Promise<Run[]> {
  return RunModel.find({ userId }).exec();
}

function get(id: string, userId: string): Promise<Run | null> {
  return RunModel.findOne({ id, userId }).exec();
}

function create(userId: string, run: Partial<Run>): Promise<Run> {
  const began = ensureDate(run.began) || new Date();
  const doc = new RunModel({
    ...run,
    id: run.id || new Types.ObjectId().toString(),
    userId,
    began,
  });
  return doc.save();
}

function update(id: string, userId: string, run: Partial<Run>): Promise<Run> {
  const began = ensureDate(run.began);
  const updateFields: Partial<Run> = { ...run };

  if (began) updateFields.began = began;
  delete (updateFields as any).userId;
  delete (updateFields as any).id;

  return RunModel.findOneAndUpdate({ id, userId }, updateFields, { new: true })
    .then((updated) => {
      if (!updated) throw `${id} not found`;
      return updated;
    });
}

function remove(id: string, userId: string): Promise<void> {
  return RunModel.findOneAndDelete({ id, userId }).then((deleted) => {
    if (!deleted) throw `${id} not found`;
  });
}

export { RunModel };

export default { index, get, create, update, remove, RunModel };
