// users.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('/get-user/:id')
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Post('/add-user')
  async create(
    @Body()
    createUser: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    },
  ) {
    const { firstName, lastName, email, phoneNumber } = createUser;
    return this.usersService.create(firstName, lastName, email, phoneNumber);
  }

  @Put('/update-user/:id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: number,
    @Body()
    updateUser: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    },
  ) {
    const { firstName, lastName, email, phoneNumber } = updateUser;
    return this.usersService.update(
      id,
      firstName,
      lastName,
      email,
      phoneNumber,
    );
  }

  @Delete('/delete-user/:id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
