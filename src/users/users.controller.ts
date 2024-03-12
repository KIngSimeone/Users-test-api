// users.controller.ts
import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(+id); // Convert id to a number
  }

  @Post()
  async create(@Body() createUser: { firstName: string; lastName: string; email: string; phoneNumber: string }) {
    const { firstName, lastName, email, phoneNumber } = createUser;
    return this.usersService.create(firstName, lastName, email, phoneNumber);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUser: { firstName: string; lastName: string; email: string; phoneNumber: string },
  ) {
    const { firstName, lastName, email, phoneNumber } = updateUser;
    return this.usersService.update(+id, firstName, lastName, email, phoneNumber); // Convert id to a number
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id); // Convert id to a number
  }
}
