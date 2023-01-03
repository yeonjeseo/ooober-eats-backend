import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { MailModuleOptions } from './mail.interfaces';
import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    this.sendEmail('test', 'test');
  }

  /*
  curl -s --user 'api:YOUR_API_KEY' \
	https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
	-F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
	-F to=YOU@YOUR_DOMAIN_NAME \
	-F to=bar@example.com \
	-F subject='Hello' \
	-F text='Testing some Mailgun awesomeness!'
   */
  private async sendEmail(subject: string, content: string, to?: string) {
    const form = new FormData();

    form.append('from', `Excited User <mailgun@${this.options.fromEmail}>`);
    form.append('to', 'yeonjeseo@hotmail.com');
    form.append('subject', subject);
    form.append('text', content);

    try {
      const response = await got(
        `https://api.mailgun.net/v3/${this.options.emailDomain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
    } catch (e) {
      console.log(e);
    }
  }
}