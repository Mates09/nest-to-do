import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Types } from 'mongoose';
import {Item} from 'src/item/schemas/item.schema';
import { User } from 'src/auth/schemas/user.schema';




@Schema({
  timestamps: true,
})
export class List {
  @Prop({required: [true, 'List name is required.']})
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Item' }] })
  itemList: Types.ObjectId[];

  @Prop()
  usersAccess: string[];

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  userCreated: User;

}

export const ListSchema = SchemaFactory.createForClass(List);
