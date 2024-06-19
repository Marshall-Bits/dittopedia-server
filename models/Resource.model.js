import { model, Schema } from "mongoose";

const resourceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    categories: {
      type: [String],
      required: [true, "Categories are required"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
    },
    favIcon: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Globe_icon.svg/420px-Globe_icon.svg.png",
    },
  },
  {
    timestamps: true,
  }
);

const Resource = new model("Resource", resourceSchema);

export { Resource };
