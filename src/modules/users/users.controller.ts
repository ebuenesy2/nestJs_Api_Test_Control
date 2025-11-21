import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
    ) {}

    // ------------------------------------------------
    // Tüm kullanıcıları getir (sayfalı)
    // GET /users?page=1&limit=10
    // ------------------------------------------------
    @Get()
    async getAllUsers(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.usersService.getAll(page, limit);
    }

    // ------------------------------------------------
    // ID’ye göre kullanıcı bul
    // GET /users/find/:id
    // ------------------------------------------------
    @Get('find/:id')
    getById(@Param('id') id: string) {
        return this.usersService.getById(Number(id));
    } 

    // ------------------------------------------------
    // Yeni kullanıcı ekle
    // POST /users/add
    // ------------------------------------------------
    @Post('add')
    addUser(@Body() body: any) {
        return this.usersService.addUser(body);
    }


    
    // ------------------------------------------------
    // Yeni kullanıcı Güncelle
    // POST /users/edit/1
    // ------------------------------------------------
    @Post('edit/:id')
    updateUser(
        @Param('id') id: number,
        @Body() body: any
    ) {
        return this.usersService.updateUser(id,body);
    }


    // ------------------------------------------------
    // ID’ye göre kullanıcı sil
    // GET /users/delete/:id
    // ------------------------------------------------
    @Get('delete/:id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(Number(id));
    } 

}
