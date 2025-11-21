import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  //! Düz HTML mail
  @Post('send')
  async sendEmail( @Body() body: { email: string; subject: string; content: string }, ) {
    const { email, subject, content } = body;
    const send_Email = await this.emailService.sendMail(email, subject, content);

    return {
      success: true,
      message: 'Mail gönderildi!',
      send_Email,
    };
  }

  //! Tasarımlı (Handlebars template) mail
  @Post('send/template')
  async sendMail_Templates( @Body() body: { email: string; subject: string; name: string }, ) {
    const { email, subject, name } = body;
    const send_Email = await this.emailService.sendMail_Templates(email, subject, name);

    return {
      success: true,
      message: 'Mail gönderildi! - Tasarım',
      send_Email,
    };
  }
}