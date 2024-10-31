import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { List } from './schemas/list.schema';
import { User } from 'src/auth/schemas/user.schema';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from "../user/user.service"


@Injectable()
export class ListService {  

  constructor(
    @InjectModel(List.name) private listModel:  mongoose.Model<List>,
    @InjectModel(User.name) private userModel: mongoose.Model<User>, // Inject User model
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //get all lists
  async getAllLists(): Promise<List[]> {
    return this.listModel.find({});
  }


  async shareList(listId:string,body:string, cookie: string, ) {

    try {
      //get user id from token
      const decoded = jwt.verify(cookie.toString(), "secretKey", { ignoreExpiration: true });
      const UserId = decoded["user"]._id

      if (!decoded) {
        throw new UnauthorizedException('Invalid user');
      }
      console.log(listId["listId"])
      

      //find list
      const list = await this.listModel.findById(listId["listId"]);
      if (!list) {
        throw new NotFoundException('List not found');
      }

      //check if user has access to list
      const hasAccess = list.usersAccess.some(
        (userId) => userId === UserId.toString(),
      );
      if (!hasAccess) {
        throw new ForbiddenException('User does not have access to this list');
      }
      
      //add user to list
      const user = await this.usersService.findByEmail(body["name"]);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      console.log(user._id.toString())


      //check if user already has access to list
      const hasAccessUser = list.usersAccess.some(
        (userId) => userId === user._id.toString(),
      );
      if (hasAccessUser) {
        throw new ForbiddenException('User already has access to this list');
      }

      //chek if list is shared with user
      const sharedWithUser = user.listAccess.some(
        (listId) => listId === list._id.toString(),
      );
      if (sharedWithUser) {
        throw new ForbiddenException('List is already shared with this user');
      }


      list.usersAccess.push(user._id.toString());
      await list.save();

      //add list to user
      await this.userModel.findByIdAndUpdate(
        user._id,
        { $push: { listAccess: list._id } },
        { new: true }
      );
      
      return {message: "List shared successfully"};
     
    } catch (error) {
      console.log(error)
      return {message: "Failed to share list"};
       }

  }

  //create list
  async createList(lists: List, cookie: string): Promise<List> {
    try {
      //get user id from token
      const decoded = jwt.verify(cookie.toString(), "secretKey", { ignoreExpiration: true });
      const UserId = decoded["user"]._id

      if (!decoded) {
        throw new UnauthorizedException('Invalid user');
      }
    
 
      //save list to db
      const newList = Object.assign({}, lists, {
        userCreated: UserId,
        usersAccess: [UserId],
      });
      const createdList = await this.listModel.create(newList);

      //add list to user
      await this.userModel.findByIdAndUpdate(
        UserId,
        { $push: { listAccess: createdList._id } },
        { new: true }
      );
      return createdList;
    } catch (error) { 
    console.log(error)
    }
  }


  //get list by id
  async findById(id: string): Promise<List> {
    try { 
      
    const lists = await this.listModel.findById(id);

    if (!lists) {
      throw new NotFoundException('List not found.');
    }

      return lists;
    } catch (error) {
      console.log(error)
    }
  }


  //update list
  async updateById(id: string, lists: List): Promise<List> {
    return await this.listModel.findByIdAndUpdate(id, lists, {
      new: true,
      runValidators: true,
    });
  }


  //delete list
  async deleteById(id: string): Promise<List> {
    return await this.listModel.findByIdAndDelete(id);
  }












}
