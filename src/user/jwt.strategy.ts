import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public configService: ConfigService,private readonly usersService:UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_KEY'),
    });
  }
  async validate(payload: any) {
    const user =  this.usersService.findOne(payload.id);
    if(!user)
        throw new UnauthorizedException("Login first to access this endpoint.")
    return user 
  }
}
