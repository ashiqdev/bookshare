import mongoose from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  writer: {
    type: String,
  },
  summary: String,
  images: {
    type: [String],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Book", bookSchema);
