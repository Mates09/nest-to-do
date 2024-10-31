import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private readonly secret = process.env.JWT_SECRET; // Ensure this is set in your environment variables

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.user_token; // Adjust this line if you're using a different method to send the token (like headers)

    if (!token) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }

    try {
      const decoded = jwt.verify(token, this.secret); // Verify the token
      req.user = decoded; // Attach the decoded payload to the request object
      next();
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}