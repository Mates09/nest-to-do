// src/items/items.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item } from "./schemas/item.schema";
import { List } from "../list/schemas/list.schema";
import { CreateItemDto } from './dto/create-item.dto';
import { User } from 'src/auth/schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import { response } from 'express';




@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(List.name) private listModel: Model<List>,
  ) {}

  async createItemForList(listId: string, item: CreateItemDto, cookie: string,): Promise<Item> {
try{
    // Check if the list exists
    const list = await this.listModel.findById(listId);
    if (!list) {
      throw new NotFoundException('List not found');
    }

    //get user id from token
    const decoded = jwt.verify(cookie.toString(), "secretKey", { ignoreExpiration: true });
    const UserId = decoded["user"]._id

    
    // Check if the user has access to the list
    const hasAccess = list.usersAccess.some(
      (userId) => userId === UserId.toString(),
    );
    if (!hasAccess) {
      throw new ForbiddenException('User does not have access to this list');
    }

    // Create and save the new item
    const newItem = new this.itemModel({
      title: item.title,
      text: item.text,
      deadline: item.deadline,
      userCreated: UserId,
      status: "Active",
      listId: list._id, 
    });
  
    // Save the new item in the database
    const createdItem = await newItem.save();

   // Add the item to the list
    list.itemList.push(createdItem._id);
    await list.save();

  return createdItem
} catch (error) {
  console.log(error)
}
  }

// Find items by list ID
  async findItemsByList(listId: string): Promise<Item[]> {
    try { 
    console.log(listId)
    const lists = await this.listModel.findById(listId);
    console.log(lists)
      return this.itemModel.find({ listId: listId });
    } catch (error) {
      console.log(error)
    }
  }


  async updateItemStatus(itemId: string, newStatus: string, cookie: string){
    try { 
      // Check if the item exists
    const itemx = await this.itemModel.findById(itemId);
      if (!itemx) {
        
        return {message: 'Failed to update item status'};
       
      }
      
      const decoded = jwt.verify(cookie.toString(), "secretKey", { ignoreExpiration: true });
       const UserId = decoded["user"]._id

    // Check if the list exists
    const list = await this.listModel.findById(itemx.listId);
    if (!list) {
      throw new NotFoundException('List not found');
    }


    // Check if the user has access to the list
    const hasAccess = list.usersAccess.some(
      (userId) => userId === UserId.toString(),
    );
      if (!hasAccess) {
        response.status(400).send({ message: 'Failed to get items' });
      throw new ForbiddenException('User does not have access to this list');
    }


    // Check if the new status is valid
    const validStatuses = ['Active', 'Completed', 'Terminated'];
    if (!validStatuses.includes(newStatus)) {
      throw new NotFoundException('Invalid status');
    }

    //chesk if the item exists
    const item = await this.itemModel.findById(itemId);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    // Find the item by ID and update the status
    const updatedItem = await this.itemModel.findByIdAndUpdate(
      itemId,
      { status: newStatus },
      { new: true }
    );

    // Check if the item was updated
    if (!updatedItem) {
      throw new NotFoundException('Item not found');
    }

      return updatedItem;
    } catch (error) {
      console.log(error)
      return{
        "statusCode": 400,
        "message": "Failed to update item status"
      }
     }

  }

  // Get items by list ID
  async getItemsByList(listId: string): Promise<Item[]> {
    try{
    const list = await this.listModel.findById(listId).exec();
    if (!list) {
      throw new NotFoundException('List not found');
    }

    // Use itemList to find all items associated with the list
    const items = await this.itemModel.find({ _id: { $in: list.itemList } }).exec();
    return items;
  } catch (error) {
      console.log(error)
    response.status(400).send({ message: 'Failed to get items' });
  }
  }
}