import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { StrategyOptions } from 'passport-jwt';
interface JwtPayload {
  useremail: string;
  userid: string;
  iat?: number;
  exp?: number;
}
/**
 * JWT authentication strategy.
 * Validates JWT tokens and extracts user information from the payload.
 *
 * @throws {Error} If JWT_SECRET is not defined in environment variables
 * @throws {UnauthorizedException} If token payload is invalid
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    };
    super(options);
  }

  /**
   * Validates the JWT payload and returns the user object.
   *
   * @param payload - The decoded JWT payload
   * @returns User object with email and ID
   * @throws {UnauthorizedException} If payload is missing required fields
   */
  validate(payload: JwtPayload): { useremail: string; userid: string } {
    if (!payload.useremail || !payload.userid) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return {
      useremail: payload.useremail,
      userid: payload.userid,
    };
  }
}
