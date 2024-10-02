// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  content: string;
  versionHistory: any;
  currentEditor: string;
  comments: any;
}

const DocumentSchema: Schema = new Schema({
  content: String,
  currentEditor: { type: String, default: null }, // Store the ID of the current user editing
  versionHistory: [{ content: String, timestamp: Date }],
  comments: [{ userId: String, comment: String, section: String }],
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
