import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
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
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });

    if (!this.configService.get<string>('JWT_SECRET')) {
      throw new Error('JWT_SECRET must be defined in environment variables');
    }
  }

  /**
   * Validates the JWT payload and returns the user object.
   * 
   * @param payload - The decoded JWT payload
   * @returns User object with email and ID
   * @throws {UnauthorizedException} If payload is missing required fields
   */
  async validate(payload: any) {
    if (!payload?.useremail || !payload?.userid) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return { 
      useremail: payload.useremail, 
      userid: payload.userid 
    };
  }
}