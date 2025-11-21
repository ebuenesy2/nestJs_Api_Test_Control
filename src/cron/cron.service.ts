import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import axios from 'axios';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    // RAM’de veri saklayacak dizi
    private successList: any[] = [];
    private errorList: any[] = [];

    constructor(private schedulerRegistry: SchedulerRegistry) {}

    // RAM kayıt limiti
    private MAX_LIMIT = 500;

    // -------------------------------------------------
    // Liste Temizleme İşlemi
    // -------------------------------------------------
    private cleanupList(list: any[]) {
        if (list.length > this.MAX_LIMIT) {
            const removeCount = list.length - this.MAX_LIMIT;
            list.splice(0, removeCount); // en eski kayıtları sil
        }
    }

    // -------------------------------------------------
    // Liste temizleme (success + error)
    // -------------------------------------------------
    private cleanupAll() {
        this.cleanupList(this.successList);
        this.cleanupList(this.errorList);
    }
    
     
    // -------------------------------------------------
    // API testi metodu
    // -------------------------------------------------
    async testApiInternal() {
        try {
            const response = await axios.get('https://nest-js-sabit.vercel.app/test');
            const data = response.data;

            const targetList = data.status ? this.successList : this.errorList;
            const newEntry = {
                id: targetList.length > 0 ? targetList[targetList.length - 1].id + 1 : 1,
                timestamp: new Date().toISOString(),
                data
            };

            // RAM temizlik kontrolü
            this.cleanupAll();

            if (data.status) {
                this.successList.push(newEntry);
                this.logger.log(`SUCCESS eklendi: ${JSON.stringify(newEntry)}`);
            } else {
                this.errorList.push(newEntry);
                this.logger.error(`ERROR eklendi: ${JSON.stringify(newEntry)}`);
            }
        } catch (error) {
            const newEntry = {
                id: this.errorList.length > 0 ? this.errorList[this.errorList.length - 1].id + 1 : 1,
                timestamp: new Date().toISOString(),
                data: { error: error.message }
            };
            this.errorList.push(newEntry);
            this.logger.error(`API HATA oluştu: ${error.message}`);
        }
    }

    // -------------------------------------------------
    // Manuel Cron Oluştur / İstediğin saatte çalıştır
    // Örn: saat = 14, dakika = 30
    // -------------------------------------------------
    scheduleApiTest(hour: number, minute: number) {
        const jobName = `api-test-${hour}-${minute}`;
        const cronTime = `0 ${minute} ${hour} * * *`; // saniye dakika saat gün ay hafta

        // Cron job oluştur
        const job = new CronJob(cronTime, () => {
            this.logger.log(`Scheduled API Test çalıştı: ${hour}:${minute}`);
            this.testApiInternal();
        });

        this.schedulerRegistry.addCronJob(jobName, job);
        job.start();

        return { message: `API Test cron job oluşturuldu: ${hour}:${minute}`, jobName };
    }

    // -------------------------------------------------
    // 5 Dakikalık cron (her dakika)
    // -------------------------------------------------
    @Cron('0 */5 * * * *') 
    handleEveryMinute() {
        this.logger.log('5 Dakikalık API testi çalıştı');
        this.testApiInternal();
    }

    // -------------------------------------------------
    // Sabah 08:30
    // -------------------------------------------------
    @Cron('0 30 8 * * *')
    handleMorning() {
        this.logger.log('Sabah 08:30 API testi çalıştı');
        this.testApiInternal();
    }

    // -------------------------------------------------
    // Akşam 18:50
    // -------------------------------------------------
    @Cron('0 50 18 * * *')
    handleEvening() {
        this.logger.log('Akşam 18:50 API testi çalıştı');
        this.testApiInternal();
    }

    // -------------------------------------------------
    // Manuel API testi (endpoint üzerinden çağır)
    // -------------------------------------------------
    async runNow() {
        this.logger.log('Manuel API testi çalıştırıldı');
        await this.testApiInternal();
    }

    // -------------------------------------------------
    // Her gece 00:00 RAM temizleme (isteğe bağlı)
    // -------------------------------------------------
    @Cron('0 0 0 * * *')
    clearDaily() {
        this.successList = [];
        this.errorList = [];
        this.logger.warn('Günlük RAM temizliği yapıldı (00:00)');
    }

    // -------------------------------------------------
    // Listeleme metodları (ID DESC + pagination)
    // -------------------------------------------------
    getSuccessList(page: number = 1, limit: number = 10) {
        const sorted = [...this.successList].sort((a, b) => b.id - a.id);
        const total = sorted.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = sorted.slice(start, end);
        return { title: 'Success List', page, limit, total, totalPages, data };
    }

    getErrorList(page: number = 1, limit: number = 10) {
        const sorted = [...this.errorList].sort((a, b) => b.id - a.id);
        const total = sorted.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = sorted.slice(start, end);
        return { title: 'Error List', page, limit, total, totalPages, data };
    }
}
