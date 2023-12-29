import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './types/user.types';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('Users') private readonly userModel: Model<IUser>) {}

  async findAll(): Promise<IUser[]> {
    return this.userModel.find({ isValid: true }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    return this.userModel.create(createUserDto);
  }

  async findById(id: string): Promise<IUser> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException('Invalid id');
    }

    const user = await this.userModel.findById(id);

    if (!user || !user.isValid) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async delete(id: string): Promise<IUser> {
    return this.userModel.findByIdAndUpdate(id, { isValid: false });
  }

  async deletePermit(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id);
  }

  async addHistory(createHistoryDto: CreateHistoryDto): Promise<IUser> {
    return this.userModel.findByIdAndUpdate(createHistoryDto.idUser, {
      $push: { productsId: createHistoryDto.idProduct },
    });
  }
}
