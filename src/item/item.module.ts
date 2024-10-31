import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './schemas/item.schema';
import { ListModule } from 'src/list/list.module';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
  ListModule,  UsersModule,],

  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
