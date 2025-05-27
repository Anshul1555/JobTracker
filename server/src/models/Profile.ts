import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define a subdocument type for a job entry
interface Job {
  title: string;
  company?: string;
  link: string;
  status?: string;
}

// Define an interface for the Profile document
export interface IProfile extends Document {
  name: string;
  email: string;
  password: string;
  jobs: Job[];
  isCorrectPassword(password: string): Promise<boolean>;
}

// Define the schema for the Profile document
const profileSchema = new Schema<IProfile>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must match an email address!'],
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    jobs: [
      {
        title: { type: String, required: true },
        company: { type: String },
        link: { type: String, required: true },
        status: { type: String, default: 'applied' },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Pre-save middleware to hash password if it's new or modified
profileSchema.pre<IProfile>('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Instance method to check if a password is correct
profileSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Create and export the Profile model
const Profile = model<IProfile>('Profile', profileSchema);

export default Profile;
