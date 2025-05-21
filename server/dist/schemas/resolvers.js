import { Profile } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
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
            throw AuthenticationError;
        },
    },
    Mutation: {
        addProfile: async (_parent, { input }) => {
            const profile = await Profile.create({ ...input });
            const token = signToken(profile.name, profile.email, profile._id);
            return { token, profile };
        },
        login: async (_parent, { email, password }) => {
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
        addJob: async (_parent, { profileId, job }, context) => {
            if (context.user) {
                return await Profile.findOneAndUpdate({ _id: profileId }, { $addToSet: { jobs: job } }, { new: true, runValidators: true });
            }
            throw AuthenticationError;
        },
        removeProfile: async (_parent, _args, context) => {
            if (context.user) {
                return await Profile.findOneAndDelete({ _id: context.user._id });
            }
            throw AuthenticationError;
        },
        removeJob: async (_parent, { title }, context) => {
            if (context.user) {
                return await Profile.findOneAndUpdate({ _id: context.user._id }, { $pull: { jobs: { title } } }, // pull job by title
                { new: true });
            }
            throw AuthenticationError;
        },
    },
};
export default resolvers;
