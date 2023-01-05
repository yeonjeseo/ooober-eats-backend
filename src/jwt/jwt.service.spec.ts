import { JwtService } from './jwt.service';
import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from '../common/common.constants';
import * as jwt from 'jsonwebtoken';

/**
 * npm 패키지를 Mock
 */
jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'TOKEN'),
    verify: jest.fn(),
  };
});
const TEST_KEY = 'testKey';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        /**
         * DI에 사용되었던 @Inject decorator 부분을 이렇게 가짜 데이터로 대체 가능
         */
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            privateKey: TEST_KEY,
          },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should return a signed token', () => {
      /**
       * 서비스 그 자체만 테스트 하고 싶음. jwt 라이브러리 종속성을 제거해야 함.
       * jsonwebtoken 을 Mock
       */
      const ID = 1;
      const token = service.sign(ID);
      // jwt 모듈이 적절한 매개변수와 함께 호출이 되었는지?
      expect(typeof token).toBe('string');
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith({ id: ID }, TEST_KEY);
    });

    describe('verify', () => {
      it('should return the decoded token', () => {});
    });
  });

  describe('verify', () => {});
});