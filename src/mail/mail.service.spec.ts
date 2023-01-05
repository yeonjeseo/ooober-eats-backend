import { MailService } from './mail.service';
import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from '../common/common.constants';
import * as FormData from 'form-data';
import got from 'got';

jest.mock('got');

jest.mock('form-data');

const TEST_DOMAIN = 'test-domain';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'testKey',
            emailDomain: TEST_DOMAIN,
            fromEmail: 'testEmail',
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should call sendEmail', () => {
      const sendVerificationEmailArgs = {
        email: 'email',
        code: 'code',
      };
      /**
       * 함수 자체를 Mock 할 수 없을 때 - spyOn
       * mock을 하면 안되는 이유 - sendEmail 함수 또한 테스트해야 함.
       */
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => true); // mockImplementation 을 통해서

      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );

      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        'Verify your Email',
        'goatyeonje@gmail.com',
        'verify-account',
        [
          { key: 'code', value: sendVerificationEmailArgs.code },
          { key: 'username', value: sendVerificationEmailArgs.email },
        ],
      );
    });
  });

  describe('sendEmail', () => {
    /**
     *  FormData is not a constructor
     *  form-data 가 함수 하나만 가지고 있는 Object를 리턴하도록 정의했기 때문
     *  패키지 전체를 Mock 해서 해결
     */

    it('sends email', async () => {
      const result = await service.sendEmail('', '', '', [
        { key: 'code', value: 'code' },
      ]);
      const formSpy = jest.spyOn(FormData.prototype, 'append');

      expect(formSpy).toHaveBeenCalled();
      expect(got.post).toHaveBeenCalledTimes(1);
      expect(got.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
      );
      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
        expect.any(Object),
      );
      expect(result).toEqual(true);
    });

    it('fails on error', async () => {
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });

      const result = await service.sendEmail('', '', '', [
        { key: 'code', value: 'code' },
      ]);

      expect(result).toEqual(false);
    });
  });
});