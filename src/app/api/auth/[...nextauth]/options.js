import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import { connectDB } from '../../../../lib/models/dbConnect';
import User from '../../../../lib/models/users';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        }),
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            await connectDB();

            if (!user.email) {
                console.error('No email returned from OAuth provider');
                return false;
            }

            let existingUser = await User.findOne({ email: user.email });

            if (!existingUser) {
                // Sanitize and validate username
                const rawName = user.name || 'Anonymous';
                const baseUsername = rawName
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .replace(/[^a-z0-9_.]/g, '');

                // Fallback if sanitization results in empty username
                const safeUsername = baseUsername || `user${Date.now()}`;

                const newUser = new User({
                    name: safeUsername,
                    email: user.email,
                    password: 'OAuth',
                    emailVerified: true,
                    profilePicture: user.image || 'https://clash-tournament-hub.vercel.app/default-avatar.png',
                });
                if( account.provider === 'discord' && profile.id) {
                    newUser.discordID = profile.id;
                }

                await newUser.save();
            }

            if (existingUser && account.provider === 'discord' && profile.id) {
                existingUser.discordID = profile.id;
                await existingUser.save();
            }

            return true;
        },

        async redirect({ url, baseUrl }) {
            if (url && url.startsWith(baseUrl)) {
                return url;
            }
            return baseUrl;
        },

        async jwt({ token, user }) {
            if (user) {
                await connectDB();
                const dbUser = await User.findOne({ email: user.email }).lean();
                if (dbUser) token.id = dbUser._id.toString();
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                await connectDB();
                session.user.id = token.id;

                const user = await User.findById(token.id).lean();
                if (user) {
                    session.user.name = user.name;
                    session.user.email = user.email;
                    session.user.image = user.profilePicture;
                }
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        signup: '/auth/signup',
        signOut: '/auth/signout',
        error: '/auth/error',
        verifyRequest: '/auth/verify-request',
        newUser: null // Will disable the new account creation screen
    }
};