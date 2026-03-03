import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./prisma";

const loginStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback",
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error("No email from Google"));

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return done(null, false);
      }

      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: profile.id },
        });
      }

      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  }
);

const signupStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/signup/callback",
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error("No email from Google"));

      let user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        return done(null, false);
      }

      user = await prisma.user.create({
        data: { email, googleId: profile.id },
      });

      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  }
);

passport.use("google-login", loginStrategy);
passport.use("google-signup", signupStrategy);

export default passport;
