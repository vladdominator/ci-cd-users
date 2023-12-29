import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop()
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ default: true })
  isValid: boolean;

  @Prop({ default: 'bi' })
  role: string;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }],
  })
  productsId: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
