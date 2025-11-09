import mongoose, { Document, Schema, Model, ObjectId } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role_id: ObjectId;  // Ue role_id reference instead of enum
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for User model (optional static methods can go here)
export interface IUserModel extends Model<IUser> {
  // Add any static methods here if needed
}

// Define schema
const userSchema = new Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role_id: {
    type: Schema.Types.ObjectId,
    ref: 'Role',          // References Role collection
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the model
const User = mongoose.model<IUser, IUserModel>('User', userSchema);
export { User };
