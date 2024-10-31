import { Module } from '@nestjs/common';
import { ConfigService,ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UserSchema } from './schemas/user.schema';
import { User } from './schemas/user.schema';
import { UsersModule } from '../user/user.module';

import { UsersService } from 'src/user/user.service';
import { JwtStrategy,JwtSecretTMP } from './jwt.strategy';




@Module({
  imports: [
   UsersModule,
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretTMP,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
 exports: [JwtStrategy, PassportModule,MongooseModule,AuthService],
})
export class AuthModule {}