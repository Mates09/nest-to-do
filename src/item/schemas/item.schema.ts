import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { List } from 'src/list/schemas/list.schema';

export enum Status {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  TERMINATED = 'Terminated',

}

@Schema({
  timestamps: true,
})
export class Item {

  @Prop({ required: true })
  title: string;
  
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, default: Date.now, })
  deadline: Date;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  userCreated: User;

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;

  @Prop({ type: Types.ObjectId, ref: 'List', required: true })
  listId: List
}

export const ItemSchema = SchemaFactory.createForClass(Item);
