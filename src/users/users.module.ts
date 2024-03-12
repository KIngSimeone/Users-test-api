import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from '../sequelize.config';
import { User } from './users.schema';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { configs } from '../config';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: configs.JWT_SECRET, 
      signOptions: { expiresIn: '24h' }, 
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
