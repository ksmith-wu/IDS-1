import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  user_id: mongoose.Types.ObjectId;
  token: string;
  created_at: Date;
  expires_at: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true }
  },
  { timestamps: true }
);

export const Session = mongoose.model<ISession>('Session', SessionSchema);
