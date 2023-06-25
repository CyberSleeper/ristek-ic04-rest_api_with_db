import mongoose from "mongoose";

const UserModel = mongoose.model('User',
  new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    tags: [{ type: String }]
  })
);