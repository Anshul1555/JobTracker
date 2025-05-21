import { Profile } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface Job {
  title: string;
  company?: string;
  link: string;
  status?: string;
}

interface ProfileType {
  _id: string;
  name: string;
  email: string;
  password: string;
  jobs: Job[];
}

interface ProfileArgs {
  profileId: string;
}

interface AddProfileArgs {
  input: {
    name: string;
    email: string;
    password: string;
  };
}

interface AddJobArgs {
  profileId: string;
  job: Job;
}

interface RemoveJobArgs {
  profileId: string;
  title: string; // remove by title for simplicity
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
      throw AuthenticationError;
    },
  },

  Mutation: {
    addProfile: async (_parent: any, { input }: AddProfileArgs): Promise<{ token: string; profile: ProfileType }> => {
      const profile = await Profile.create({ ...input });
      const token = signToken(profile.name, profile.email, profile._id);
      return { token, profile };
    },

    login: async (
      _parent: any,
      { email, password }: { email: string; password: string }
    ): Promise<{ token: string; profile: ProfileType }> => {
      const profile = await Profile.findOne({ email });
      if (!profile) {
        throw AuthenticationError;
      }
      const correctPw = await profile.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(profile.name, profile.email, profile._id);
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
      throw AuthenticationError;
    },

    removeProfile: async (_parent: any, _args: any, context: Context): Promise<ProfileType | null> => {
      if (context.user) {
        return await Profile.findOneAndDelete({ _id: context.user._id });
      }
      throw AuthenticationError;
    },

    removeJob: async (_parent: any, { profileId, title }: RemoveJobArgs, context: Context): Promise<ProfileType | null> => {
      if (context.user) {
        return await Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { jobs: { title } } }, // pull job by title
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;
