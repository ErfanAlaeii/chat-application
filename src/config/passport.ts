import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import prisma from '../prisma/client';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret_key',
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload: JwtPayload, done: (error: any, user?: any, info?: any) => void) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: jwtPayload.id } });
      if (!user) return done(null, false);
      return done(null, jwtPayload);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
