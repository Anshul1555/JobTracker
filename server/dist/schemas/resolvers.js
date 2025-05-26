import { Profile } from '../models/index.js';
import { AuthenticationError } from 'apollo-server-errors';
import { signToken } from '../utils/auth.js';
const resolvers = {
    Query: {
        profiles: async () => {
            return await Profile.find();
        },
        profile: async (_parent, { profileId }) => {
            return await Profile.findOne({ _id: profileId });
        },
        me: async (_parent, _args, context) => {
            if (context.user) {
                return await Profile.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You must be logged in');
        },
    },
    Mutation: {
        addProfile: async (_parent, { input }) => {
            const jobs = input.jobs || [];
            const profile = await Profile.create({ ...input, jobs });
            const token = signToken(profile.name, profile.email, profile._id.toString());
            return { token, profile };
        },
        login: async (_parent, { email, password }) => {
            const profile = await Profile.findOne({ email });
            if (!profile) {
                throw new AuthenticationError('Invalid credentials');
            }
            const correctPw = await profile.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Invalid credentials');
            }
            const token = signToken(profile.name, profile.email, profile._id.toString());
            return { token, profile };
        },
        addJob: async (_parent, { profileId, job }, context) => {
            if (context.user) {
                return await Profile.findOneAndUpdate({ _id: profileId }, { $addToSet: { jobs: job } }, { new: true, runValidators: true });
            }
            throw new AuthenticationError('You must be logged in');
        },
        removeProfile: async (_parent, _args, context) => {
            if (context.user) {
                return await Profile.findOneAndDelete({ _id: context.user._id });
            }
            throw new AuthenticationError('You must be logged in');
        },
        removeJob: async (_parent, { jobId }, context) => {
            if (context.user) {
                return await Profile.findOneAndUpdate({ _id: context.user._id }, { $pull: { jobs: { _id: jobId } } }, { new: true });
            }
            throw new AuthenticationError('You must be logged in');
        },
        updateJobStatus: async (_parent, { jobId, status }, context) => {
            if (context.user) {
                const profile = await Profile.findOne({ _id: context.user._id });
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
