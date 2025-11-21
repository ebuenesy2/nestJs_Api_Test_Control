import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TestController } from './test/test.controller';
import { TestService } from './test/test.service';

//! Mail
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'; //! Mail
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';



@Module({
  imports: [ConfigModule,
     MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 587,
        secure: false, // TLS kullanmak istersen bunu true yapabilirsin
        auth: {
          user: process.env.MAIL_USERNAME || 'ebuenesdeneme@gmail.com',
          pass: process.env.MAIL_PASSWORD || 'vyfyhlwvmmwdubbw',
        },
      },
      defaults: {
        //from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        from: '"YıldırımDev" <no-reply@yildirimdev.com>',
      },
      template: {
        dir: join(process.cwd(), 'src/email/templates'),  // email tasarım
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  controllers: [TestController, EmailController],
  providers: [TestService, EmailService],
})
export class AppModule {} 