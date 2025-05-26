import { Profile } from '../models/index.js';
import { AuthenticationError } from 'apollo-server-errors';
import { signToken } from '../utils/auth.js';
import { Types, Document } from 'mongoose';

interface Job {
  _id?: string;  // _id optional on input, present on output
  title: string;
  company?: string;
  link: string;
  status?: string;
}

interface ProfileType {
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  password: string;
  jobs: Job[];
  isCorrectPassword?: (password: string) => Promise<boolean>;
}

interface ProfileArgs {
  profileId: string;
}

interface AddProfileArgs {
  input: {
    name: string;
    email: string;
    password: string;
    jobs?: Job[];
  };
}

interface AddJobArgs {
  profileId: string;
  job: Job;
}

interface Context {
  user?: ProfileType;
}

const resolvers = {
  Query: {
    profiles: async (): Promise<ProfileType[]> => {
      return await Profile.find();
    },

    profile: async (_parent: any, { profileId }: ProfileArgs): Promise<ProfileType | null> => {
      return await Profile.findOne({ _id: profileId });
    },

    me: async (_parent: any, _args: any, context: Context): Promise<ProfileType | null> => {
      if (context.user) {
        return await Profile.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You must be logged in');
    },
  },

  Mutation: {
    addProfile: async (_parent: any, { input }: AddProfileArgs): Promise<{ token: string; profile: ProfileType }> => {
      const jobs = input.jobs || [];
      const profile = await Profile.create({ ...input, jobs });
      const token = signToken(profile.name, profile.email, profile._id.toString());
      return { token, profile };
    },

    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; profile: ProfileType }> => {
      const profile: Document<any, any, ProfileType> & ProfileType | null = await Profile.findOne({ email });

      if (!profile) {
        throw new AuthenticationError('Invalid credentials');
      }

      const correctPw = await profile.isCorrectPassword!(password);

      if (!correctPw) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = signToken(profile.name, profile.email, profile._id.toString());
      return { token, profile };
    },

    addJob: async (_parent: any, { profileId, job }: AddJobArgs, context: Context): Promise<ProfileType | null> => {
      if (context.user) {
        return await Profile.findOneAndUpdate(
          { _id: profileId },
          { $addToSet: { jobs: job } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError('You must be logged in');
    },

    removeProfile: async (_parent: any, _args: any, context: Context): Promise<ProfileType | null> => {
      if (context.user) {
        return await Profile.findOneAndDelete({ _id: context.user._id });
      }
      throw new AuthenticationError('You must be logged in');
    },

    removeJob: async (_parent: any, { jobId }: { jobId: string }, context: Context): Promise<ProfileType | null> => {
      if (context.user) {
        return await Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { jobs: { _id: jobId } } },
          { new: true }
        );
      }
      throw new AuthenticationError('You must be logged in');
    },

    updateJobStatus: async (_parent: any, { jobId, status }: { jobId: string; status: string }, context: Context): Promise<Job | null> => {
      if (context.user) {
        const profile = await Profile.findOne({ _id: context.user._id }) as Document<any, any, ProfileType> & ProfileType;

        if (!profile) {
          throw new AuthenticationError('Profile not found');
        }

        const job = profile.jobs.id(jobId);
        if (!job) {
          throw new Error('Job not found');
        }

        job.status = status;
        await profile.save();
        return job;
      }
      throw new AuthenticationError('You must be logged in');
    },
  },
};

export default resolvers;
