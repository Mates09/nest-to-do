// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './user.service';
import { User, UserSchema } from "./scheme/user.schema";
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService],   // Provide UsersService here
  exports: [UsersService,MongooseModule],      // Export UsersService so other modules can use it
})
export class UsersModule {}
