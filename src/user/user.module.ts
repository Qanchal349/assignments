import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [ TypeOrmModule.forFeature([User]),PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
       imports: [ConfigModule],
       inject: [ConfigService],
       useFactory:(config:ConfigService)=>{
           return {
               secret: config.get('JWT_KEY'),
               signOptions: {
                 expiresIn: config.get<string|number>('JWT_EXPIRE') + 's',
               },
           }
       }
    })],
    controllers: [UserController],
    providers: [JwtStrategy ,UserService],
    exports:[UserService]
})
export class UserModule {}
