import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    // RAM’de veri saklayacak dizi
    private memoryData: any[] = [];

    // -------------------------------------------------
    // Her 1 dakikada bir çalışacak cron job
    // -------------------------------------------------
    @Cron('0 */1 * * * *') // her dakika başı
    handleCron() {

        const newData = {
            id: this.memoryData.length > 0 ? this.memoryData[this.memoryData.length - 1].id + 1 : 1,
            timestamp: new Date().toISOString(),
            value: Math.floor(Math.random() * 100) // rastgele sayı
        };

        // RAM içindeki diziye ekle
        this.memoryData.push(newData);

        this.logger.log(`Yeni veri eklendi: ${JSON.stringify(newData)}`);
        this.logger.log(`Toplam kayıt sayısı: ${this.memoryData.length}`);
    }

    
    // -------------------------------------------------
    // RAM’deki veriyi sayfalı ve ID sıralı olarak getir
    // -------------------------------------------------
    getMemoryData(page: number = 1, limit: number = 10) {
        // ID büyükten küçüğe sıralama
        const sortedData = [...this.memoryData].sort((a, b) => b.id - a.id);

        // Sayfalama
        page = Number(page);
        limit = Number(limit);

        const total = sortedData.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;
        const end = start + limit;

        const data = sortedData.slice(start, end);

        return {
            title: "RAM Verileri",
            page,
            limit,
            total,
            totalPages,
            data
        };
    }
}
