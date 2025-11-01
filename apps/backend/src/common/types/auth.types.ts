import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userid: number;
    email: string;
    roles?: string[];
  };
}
