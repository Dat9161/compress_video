import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../utils/prisma';

// Dummy serialize/deserialize để tránh lỗi khi session: false
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user as Express.User));

export function initPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: '/api/auth/google/callback',
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email from Google'));

          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || email.split('@')[0],
                avatarUrl: profile.photos?.[0]?.value,
                provider: 'GOOGLE',
                isVerified: true,
              },
            });
          }

          // Trả về plain object, convert BigInt
          done(null, {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
          });
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );
}

export default passport;
