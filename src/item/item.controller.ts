import { Controller, Get, Post,Req, Body, Patch, Param,  UseGuards, Delete, NotFoundException } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './schemas/item.schema';
import { AuthGuard } from '@nestjs/passport';
import { list } from 'lodash';
import {User} from 'src/auth/schemas/user.schema';
import { get } from 'http';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import express from 'express';
import { NotFoundError } from 'rxjs';

@UseGuards(JwtGuard)
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }
  

// create item
  @Post('create/:listId')
  @UseGuards(AuthGuard("jwt"))
  async createItem(
    @Param('listId') listId: string,
    @Body() 
    item: CreateItemDto,
    @Req() req,  
  ): Promise<Item> {
    try { 
    return this.itemService.createItemForList(listId, item, req.cookies.user_token);
  } catch (error) {
    console.log(error)
  }
  }

//get all items
  @Get('/getItems/:listId')
  async getItemsByList(@Param('listId') listId: string): Promise<Item[]> {
    try { 
    const items = await this.itemService.getItemsByList(listId);
    return items;
  } catch (error) {
    console.log(error)
  }
  }
  
  //update item status
  @Patch('status/:id')
  @UseGuards(AuthGuard("jwt"))
  async updateItemStatus(
    
    @Param('id') itemId: string,
    @Body('status') newStatus: string,
    @Req() req,  
  ) {
    try { 
    if (!newStatus) {
      throw new NotFoundException('Status is required');
      }
      return this.itemService.updateItemStatus(itemId, newStatus, req.cookies.user_token);
  
    } catch (error) {
      console.log(error)
      return {message: 'Failed to update item status'};
    
    }
  }
  
}