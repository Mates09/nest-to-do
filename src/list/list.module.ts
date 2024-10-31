import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { ListSchema } from './schemas/list.schema';
import { User } from 'src/auth/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/user/user.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'List', schema: ListSchema }],
  
  ),
  UsersModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET || 'your_secret_key', // Use a strong secret in production
    signOptions: { expiresIn: '60s' }, // Set expiration time as needed
  }),],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService,MongooseModule],
})
export class ListModule {}
