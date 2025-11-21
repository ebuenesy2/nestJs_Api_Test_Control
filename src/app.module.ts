import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TestController } from './modules/test/test.controller';
import { TestService } from './modules/test/test.service';

import { UsersService } from './modules/users/users.service';
import { UsersController } from './modules/users/users.controller';


@Module({
  imports: [ConfigModule],
  controllers: [TestController, UsersController],
  providers: [TestService, UsersService],
})
export class AppModule {} 