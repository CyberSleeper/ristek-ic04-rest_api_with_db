import mongoose from 'mongoose';

export interface I_AuthDocument extends mongoose.Document {
  name: string;
  password: string;
}

const AuthSchema: mongoose.Schema<I_AuthDocument> = new mongoose.Schema({
  name: { type: String, unique: true },
  password: { type: String },
});

const AuthModel = mongoose.model<I_AuthDocument>('Auth', AuthSchema);