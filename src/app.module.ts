import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

import { TestController } from './test/test.controller';
import { TestService } from './test/test.service';

import { CronService } from './cron/cron.service';
import { CronController } from './cron/cron.controller';


@Module({
  imports: [ConfigModule,
    ScheduleModule.forRoot(), // cron job için gerekli
  ],
  controllers: [TestController, CronController],
  providers: [TestService, CronService],
})
export class AppModule {} 