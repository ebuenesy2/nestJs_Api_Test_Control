import { Controller, Get, Query } from '@nestjs/common';
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

    // GET /cron/memory?page=1&limit=10
    @Get('/memory')
    getAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.cronService.getMemoryData(page, limit);
    }
}
