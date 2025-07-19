import { Schema, Document, models, model } from "mongoose";

export interface CollegeInterface extends Document {
  name: string;
}

const CollegeSchema = new Schema<CollegeInterface>({
  name: { type: String, required: true },
});

const CollegeModel =
  models.College || model<CollegeInterface>("College", CollegeSchema);

export default CollegeModel;
