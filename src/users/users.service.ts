import {
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
  ) {
    const existingUser = await this.findUserByEmailOrPhoneNumber(
      email,
      phoneNumber,
    );

    if (existingUser) {
      throw new BadRequestException(
        'User with the same email or phone number already exists',
      );
    }
    return this.userModel.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
  }

  async findUserByEmailOrPhoneNumber(email: string, phoneNumber: string) {
    const user = await this.userModel.findOne({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });

    return user || null;
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

    if (existingUser.id !== id) {
      throw new ForbiddenException(
        `You do not have permission to update user with ID ${id}`,
      );
    }

    const userWithEmail = await this.userModel.findOne({
      where: { email, id: { [Op.not]: id } },
    });

    if (userWithEmail) {
      throw new ConflictException(
        `Email ${email} is already in use by another user`,
      );
    }

    const userWithPhoneNumber = await this.userModel.findOne({
      where: { phoneNumber, id: { [Op.not]: id } },
    });

    if (userWithPhoneNumber) {
      throw new ConflictException(
        `Phone number ${phoneNumber} is already in use by another user`,
      );
    }

    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.email = email;
    existingUser.phoneNumber = phoneNumber;

    await existingUser.save();

    return existingUser.toJSON();
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

  async getUserByIDForJwt(email: any) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new HttpException('Invalid User', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return user;
    }

    return null;
  }

  async validateUserById(userId: number) {
    return await this.findById(userId);
  }

  async hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
    });

    return user || null;
  }
}
