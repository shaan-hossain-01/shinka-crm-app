import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import { env } from '../config/env';
import { findUserByEmail, authenticateUser } from '../db/models/user.model';

interface AuthRequest extends Request {
  auth?: {
    _id: string;
  };
  profile?: any;
}

const signin = async (req: Request, res: Response) => {
  try {
    let user = await findUserByEmail(req.body.email);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const authenticated = await authenticateUser({
      email: req.body.email,
      password: req.body.password,
    });

    if (!authenticated) {
      return res.status(401).send({ error: "Email and password don't match." });
    }

    const token = jwt.sign({ _id: user.id }, env.JWT_SECRET);
    res.cookie('t', token, { expires: new Date(Date.now() + 9999) });

    return res.json({
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: 'Could not sign in' });
  }
};

const signout = (req: Request, res: Response) => {
  res.clearCookie('t');
  return res.status(200).json({
    message: 'signed out',
  });
};

const requireSignin = expressJwt({
  secret: env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
});

const hasAuthorization = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authorized = req.profile && req.auth && req.profile.id == req.auth._id;
  
  if (!authorized) {
    return res.status(403).json({
      error: 'User is not authorized',
    });
  }
  
  next();
};

export {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
};
