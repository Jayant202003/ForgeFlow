const mongoose = require("mongoose");
const { Schema } = mongoose;

const FileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const RepositorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      default: "",
    },

    visibility: {
      type: Boolean,
      default: true,
    },
    stars: {
  type: Number,
  default: 0,
},

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    files: [FileSchema],

    content: [
      {
        type: String,
      },
    ],

    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Repository = mongoose.model(
  "Repository",
  RepositorySchema
);

module.exports = Repository;