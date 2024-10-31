import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  NotFoundException
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './schemas/list.schema';

import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/jwt-auth.guard';


@Controller('list')
export class ListController {
  constructor(private listService: ListService) { }
  

//Get all lists
  @Get("all")
  async getAllLists(): Promise<List[]> {
    return this.listService.getAllLists();
  }


  @UseGuards(JwtGuard)
  @Post('share/:listId')
  async shareList(
    @Body()
    list: CreateListDto,
    @Req() req,
    
  ) {
    try {
      return this.listService.shareList(req.params,req.body, req.cookies.user_token);
    } catch (error) {
      throw new NotFoundException('Failed to share list.');
    }
  }

   

  //Create list
  @UseGuards(JwtGuard)
  @Post()
  async createList(
    
    @Body()
    list: CreateListDto,
    @Req() req,  
  ): Promise<List> {
    try {
    return this.listService.createList(list, req.cookies.user_token);
    } catch (error) { 
      throw new NotFoundException ('Failed to create list.');
  }
  }
  //Get list by id
  @UseGuards(JwtGuard)
  @Get(':id')
  async getList(
    @Param('id')
    id: string,
  ): Promise<List> {
    try {
      return this.listService.findById(id);
    } catch (error) { 
      throw new NotFoundException ("Failed to get list.");
  }
  }

  //Update list
  @UseGuards(JwtGuard)
  @Put(':id')
  async updateList(
    @Param('id')
    id: string,
    @Body()
    list: UpdateListDto,
  ): Promise<List> {
    try {
    return this.listService.updateById(id, list);
  } catch (error) { 
    throw new NotFoundException ('Failed to update list.');
}
  }
  //Delete list
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteList(
    @Param('id')
    id: string,
  ): Promise<List> {
    try {
    return this.listService.deleteById(id);
  } catch (error) { 
    throw new NotFoundException ('Failed to delete list.');
    }
  }


}
