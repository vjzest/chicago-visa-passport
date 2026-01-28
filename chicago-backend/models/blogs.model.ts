import mongoose from "mongoose";
import { generateSlug } from "../utils/text.utils";

const blogsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      default: function () {
        return generateSlug((this as any).title);
      },
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

blogsSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = generateSlug(this.title);
  }
  next();
});
export const BlogsModel = mongoose.model("blogs", blogsSchema);
