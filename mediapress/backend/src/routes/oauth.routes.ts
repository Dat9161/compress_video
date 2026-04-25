import { Router } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';

export const oauthRouter = Router();

function getPassport() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../services/passport.service').default;
}

oauthRouter.get('/google', (req, res, next) => {
  getPassport().authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

oauthRouter.get('/google/callback', (req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  getPassport().authenticate('google', { session: false },
    (err: Error | null, user: { id: string; email: string; name: string } | false) => {
      if (err || !user) {
        console.error('OAuth error:', err?.message);
        return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
      }

      const accessOpts: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as SignOptions['expiresIn'] };
      const refreshOpts: SignOptions = { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'] };

      const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, accessOpts);
      const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, refreshOpts);

      res.redirect(`${frontendUrl}/oauth/callback#access=${accessToken}&refresh=${refreshToken}`);
    }
  )(req, res, next);
});
