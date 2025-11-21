import { Controller, Get, Post, Query } from '@nestjs/common';
import { CronService } from './cron.service';

@Controller('cron')
export class CronController {
    constructor( private readonly cronService: CronService, ) {}
    
    @Get()
    home() {
        return {
            title: "Cron",
            message: "Home",
        };
    }

    // -------------------------------------------------
    // Manuel Cron Oluştur (istediğin saat/dakikada)
    // GET /cron/schedule?hour=14&minute=30
    // -------------------------------------------------
    @Get('schedule')
    schedule(@Query('hour') hour: number, @Query('minute') minute: number) {
        return this.cronService.scheduleApiTest(Number(hour), Number(minute));
    }

    // -------------------------------------------------
    // Anlık API testi yap
    // GET /cron/run
    // -------------------------------------------------
    @Get('run')
    async runNow() {
        await this.cronService.testApiInternal();
        return { message: 'API testi çalıştırıldı' };
    }

    // -------------------------------------------------
    // Success list
    // GET /cron/success?page=1&limit=10
    // -------------------------------------------------
    @Get('success')
    getSuccess(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.cronService.getSuccessList(page, limit);
    }

    // -------------------------------------------------
    // Error list
    // GET /cron/error?page=1&limit=10
    // -------------------------------------------------
    @Get('error')
    getError(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.cronService.getErrorList(page, limit);
    }
}
