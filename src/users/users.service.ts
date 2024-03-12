import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
  ) {
    return this.userModel.create({ firstName, lastName, email, phoneNumber });
  }

  async findAll() {
    return this.userModel.findAll();
  }

  async findById(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
  ) {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const [updatedRowsCount, [updatedUser]] = await this.userModel.update(
      { firstName, lastName, email, phoneNumber },
      {
        where: { id },
        returning: true,
      },
    );

    return updatedUser;
  }

  async remove(id: number) {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const deletedRowsCount = await this.userModel.destroy({
      where: { id },
    });

    if (deletedRowsCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
