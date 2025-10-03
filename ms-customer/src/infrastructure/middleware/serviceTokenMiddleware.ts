// infrastructure/middleware/serviceTokenMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { ServiceTokenValidator } from '../adapters/ServiceTokenValidator';
const tokenValidator = new ServiceTokenValidator();

export async function serviceTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  const isValid = await tokenValidator.validate(token);

  if (!isValid) {
    return res.status(403).json({ error: 'Invalid service token' });
  }

  next();
}
