import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {

    private filePath = path.join(process.cwd(), 'temp', 'users.json');
    
    private ensureFileExists() {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '[]', 'utf8'); // boş array ile başlat
        }
    }


    private readJson() {
        this.ensureFileExists();
        const data = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(data);
    }
    
    private writeJson(data: any) {
        this.ensureFileExists();
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    }
        
    // ------------------------------------------------
    // Tüm kullanıcılar
    // ------------------------------------------------
    getAll(page: number = 1, limit: number = 10) {
        const users = this.readJson();
        users.sort((a, b) => b.id - a.id); // SIRALAMA → ID büyükten küçüğe

        //! Sayfalandırma
        page = Number(page);
        limit = Number(limit);

        const total = users.length;
        const totalPages = Math.ceil(total / limit);

        // Başlangıç ve bitiş index
        const start = (page - 1) * limit;
        const end = start + limit;

        const data = users.slice(start, end);

        return {
            title: "Sayfalı Kullanıcı Listesi",
            page,
            limit,
            total,
            totalPages,
            data
        };
    }

    // ------------------------------------------------
    // ID’ye göre kullanıcı bul
    // ------------------------------------------------
    getById(id: number) {
        const users = this.readJson();
        
        // ID ile tek kullanıcı bul
        const user = users.find(u => u.id === id);

        if (!user) { throw new NotFoundException("Kullanıcı bulunamadı"); }

        return {
            title: "Kullanıcı Bulundu",
            data: user
        };
    }

    // ------------------------------------------------
    // Yeni kullanıcı ekle
    // ------------------------------------------------
    addUser(userData: any) {
      const users = this.readJson(); 
      const newUser = { id: users.length > 0 ? users[users.length - 1].id + 1 : 1, ...userData }; 
      users.push(newUser); 
      this.writeJson(users); 
      return { title: "Yeni Kullanıcı Eklendi", data: newUser };
    }

    // ------------------------------------------------
    //  Kullanıcı güncelle
    // ------------------------------------------------
    updateUser(id: number, newData: any) {
        const users = this.readJson();
        const index = users.findIndex(u => u.id === Number(id));        

        if (index === -1) { throw new NotFoundException("Kullanıcı bulunamadı"); }

        users[index] = { ...users[index], ...newData };
        this.writeJson(users);

        return {
            title: "Kullanıcı Güncellendi",
            data: users[index]
        };
    }

    // ------------------------------------------------
    // Kullanıcı sil
    // ------------------------------------------------
    deleteUser(id: number) {
        const users = this.readJson();
        const filtered = users.filter(u => u.id !== id);

        if (filtered.length === users.length) {
            throw new NotFoundException("Kullanıcı bulunamadı");
        }

        this.writeJson(filtered);

        return {
            title: "Kullanıcı Silindi",
            id
        };
    }
}
