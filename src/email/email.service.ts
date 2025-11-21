
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  //! Mail Gönderme
  async sendMail(to: string, subject: string, content: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text: content, // düz metin gönderim
        html: `<p>${content}</p>` // HTML içerik (opsiyonel)
      });

      return {
        success: true,
        message: 'Email gönderildi!',
        time: new Date().getTime()
      };

    } catch (error) { return { success: false, message: error.message }; }
  } //! Mail Gönderme -- Son


  //! Tasarım Mail Gönderme
  async sendMail_Templates(to: string, subject: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'welcome', //! templates/welcome.hbs
        context: { name },   // hbs içinde {{name}} olarak kullanılacak
      });

      return {
        success: true,
        message: 'Email gönderildi!',
        time: new Date().getTime()
      };

    } catch (error) { return { success: false, message: error.message }; }
  }
  //! Tasarım Mail Gönderme -- Son

}
