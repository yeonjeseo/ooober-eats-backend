import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Verification } from './entities/verification.entity';
import { JwtService } from '../jwt/jwt.service';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';

/**
 * Jest는 userRepository.create 와 validationRepository.create 가 같다고 생각함
 * 함수로 만들어 useValue의 스코프 분리?
 */
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

/**
 * User Repository 의 모든 메서드를 jest.Mock 타입으로 처리하기 위한 Partial type
 */
type MockRepository<T = any> = Partial<
  Record<keyof Repository<User>, jest.Mock>
>;

describe('UserService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;

  /**
   * 모든 테스트 케이스에 대해 테스트 모듈 생성
   * Mock Repository
   */
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * createAccount 함수를 분리해서 테스트
   * 함수의 모든 부분을 테스트
   * createAccount는 어떻게 테스트 할거야?
   * 1. 만들고자 하는 유저 정보 생성 -> ok: true | ok: false -> 함수의 출력물, 결과에 대한 테스트이고 E2E 테스트
   * 2. 유닛테스트에서 하고자 하는 건 코드의 각 줄에 문제가 없는지 확인
   */
  // it.todo('createAccount');
  describe('createAccount', () => {
    const createAccountArgs = {
      email: '',
      password: '',
      role: 0,
    };
    /**
     * 모든걸 가짜로 하고 있는데 유저가 있다고 어떻게 할 수 있을까
     * mock은 함수의 반환값을 속일 수 있다.
     * createAccount 의 의존관계 반환값을 mock 한다.
     */
    it('should fail if user exists', async () => {
      /**
       * Promise의 ResolvedValue를 속인다.
       * jest가 findOne 메서드를 가로챈 뒤 (intercept) 반환 값을 속인다.
       */
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'lalalalalala',
      });

      const result = await service.createAccount(createAccountArgs);

      expect(result).toMatchObject({
        ok: false,
        error: 'There is a user with that email already',
      });
    });

    it('should create a new user', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArgs);

      await service.createAccount(createAccountArgs);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs); // 메서드 호출에 어떤 매개변수를 전달하는지??
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs); // 메서드 호출에 어떤 매개변수를 전달하는지??
    });
  });
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});