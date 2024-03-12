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
  Request,
  Response,
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
      password: string;
    },
  ) {
    const { firstName, lastName, email, phoneNumber, password } = createUser;

    const hashedPassword = await this.usersService.hashPassword(password);

    const user = await this.usersService.create(
      firstName,
      lastName,
      email,
      phoneNumber,
      hashedPassword,
    );

    const token = this.usersService.generateAccessToken({
      sub: user.id,
      email,
    });

    return {
      user: { id: user.id, firstName, lastName, email, phoneNumber },
      access_token: token,
    };
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

  @Post('/login')
  async login(@Body() loginUser: { email: string; password: string }) {
    const user = await this.usersService.validateUser(
      loginUser.email,
      loginUser.password,
    );

    if (!user) {
      return { message: 'Invalid credentials' };
    }

    const { id, firstName, lastName, email, phoneNumber } = user;
    console.log(user.id)
    // Create and return the access token
    const token = await this.usersService.generateAccessToken({
      sub: id,
      email,
    });

    return {
      user: { id: user.id, firstName, lastName, email, phoneNumber },
      access_token: token,
    };
  }
}
