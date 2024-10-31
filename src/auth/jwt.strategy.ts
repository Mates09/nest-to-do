import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { Injectable } from '@nestjs/common';

export const JwtSecretTMP = process.env.JWT_SECRET || "secretKey";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

 
  constructor() {
   
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: JwtSecretTMP,
    });
  }

// Extract JWT from cookie
  private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      'user_token' in req.cookies &&
      req.cookies.user_token.length > 0
    ) {
      return req.cookies.user_token;
    }
    return null;
  }
  
// Validate JWT
  async validate(payload: any) {
    return { userId: payload.id };
  }
}