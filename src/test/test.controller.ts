import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {

    constructor( private readonly testService: TestService, ) {}

    @Get()
    home() {
        return {
            title: "Anasayfa",
            message: "Home",
        };
    }

    @Post()
    async postSendMessage( @Body() body: any  ) {

        const Auth_Id = 100;
        const result_deneme = await this.testService.deneme(body);

        return {
            title: "Post",
            message: "Post İşlemi",
            body: body,
            body_name: body?.name,
            auth: Auth_Id,
            result_deneme:result_deneme
        };
    }

}
