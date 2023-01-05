import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';
import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  /*
  curl -s --user 'api:YOUR_API_KEY' \
	https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
	-F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
	-F to=YOU@YOUR_DOMAIN_NAME \
	-F to=bar@example.com \
	-F subject='Hello' \
	-F text='Testing some Mailgun awesomeness!'
   */
  async sendEmail(
    subject: string,
    to: string,
    template: string,
    emailVars: EmailVar[],
  ): Promise<boolean> {
    const form = new FormData();

    form.append(
      'from',
      `Yeonje from Ooober Eats <mailgun@${this.options.emailDomain}>`,
    );
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((eVars) => form.append(`v:${eVars.key}`, eVars.value));

    try {
      const response = await got.post(
        `https://api.mailgun.net/v3/${this.options.emailDomain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail(
      'Verify your Email',
      'goatyeonje@gmail.com',
      'verify-account',
      [
        { key: 'code', value: code },
        { key: 'username', value: email },
      ],
    );
  }
}