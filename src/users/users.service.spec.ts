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
  findOneOrFail: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(() => 'lalalalala'),
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
  let verificationsRepository: MockRepository<Verification>;
  let mailService: MailService;
  let jwtService: JwtService;

  /**
   * 모든 테스트 케이스에 대해 테스트 모듈 생성
   * Mock Repository
   * beforeAll -> beforeEach 로 변경
   *
   */
  beforeEach(async () => {
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
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get(getRepositoryToken(User));
    verificationsRepository = module.get(getRepositoryToken(Verification));
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
      /**
       * 서비스 로직을 테스트 하기 위해 호출된 외부 함수, 매개변수는 모두 Mocking 시킴
       * 오로지 서비스 로직 그 자체에만 테스트 집중
       */
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArgs);
      usersRepository.save.mockResolvedValue(createAccountArgs);

      verificationsRepository.create.mockReturnValue({
        user: createAccountArgs,
      });
      verificationsRepository.save.mockResolvedValue({ code: '123' });

      const result = await service.createAccount(createAccountArgs);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs); // 메서드 호출에 어떤 매개변수를 전달하는지??

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs); // 메서드 호출에 어떤 매개변수를 전달하는지??

      expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      }); // 메서드 호출에 어떤 매개변수를 전달하는지??

      expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
      }); // 메서드 호출에 어떤 매개변수를 전달하는지??

      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      // 함수, 메서드 호출 시 어떤 매개변수를 받는지 하나 하나 확인이 가능함.
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());

      const result = await service.createAccount(createAccountArgs);

      expect(result).toEqual({
        ok: false,
        error: "Couldn't created account",
      });
    });
  });

  // it.todo('login');
  describe('login', () => {
    const loginArgs = {
      email: 'bs@email',
      password: 'paspssword',
    };
    it('should fail if user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      const result = await service.login(loginArgs);
      /**
       * 테스트 실패
       * usersRepository를 모든 테스트 케이스에 대해 공유하고 있기 때문에, 위의 테스트에서 호출한 횟수도 포함되고 있음.
       */
      expect(usersRepository.findOne).toBeCalledTimes(1);
      expect(usersRepository.findOne).toBeCalledWith(expect.any(Object));
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail if password not matches', async () => {
      /**
       * users.findOne 은 id 와 CheckPassword method 가 포함되어있는 User object 를 리턴해야 함.
       */
      const mockedUser = {
        id: 1,
        /**
         * mock function 의 implement(구현) 또한 가능함.
         * checkPassword 는 jest mock function 인데, resolve 결과로 false 를 반환하는 Promise 를 반환한다.
         */
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);

      const result = await service.login(loginArgs);

      expect(usersRepository.findOne).toBeCalledTimes(1);
      expect(mockedUser.checkPassword).toBeCalledTimes(1);
      expect(result).toEqual({
        ok: false,
        error: 'Wrong password!',
      });
    });

    it('should return jwt token if password matches', async () => {
      const mockedUser = {
        id: 10,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);

      const result = await service.login(loginArgs);
      expect(jwtService.sign).toBeCalledTimes(1);
      expect(jwtService.sign).toBeCalledWith(expect.any(Number));
      expect(result).toEqual({ ok: true, token: 'lalalalala' });
    });

    it('should fail on exception', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.reject(new Error(':('))),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);

      const result = await service.login(loginArgs);
      expect(mockedUser.checkPassword).toBeCalledTimes(1);
      expect(result).toHaveProperty('ok', false);
    });
  });

  //  it.todo('findById');
  describe('findById', () => {
    const findByIdArgs = { id: 1 };
    it('should find an existing user', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await service.findById(1);
      expect(result).toEqual({ ok: true, user: findByIdArgs });
    });

    it('should fail if no user is found', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(null);

      const result = await service.findById(2);
      expect(result).toEqual({ ok: false, error: null });
    });
  });
  // it.todo('editProfile');
  describe('editProfile', () => {
    it('should change email', async () => {
      const oldUser = {
        email: 'bs@lod.com',
        verified: true,
      };
      const editProfileArgs = {
        userId: 1,
        input: { email: 'bs@new.com' },
      };
      const newVerification = {
        code: 'code',
      };
      const newUser = {
        verified: false,
        email: editProfileArgs.input.email,
      };

      usersRepository.findOne.mockResolvedValue(oldUser);
      verificationsRepository.create.mockReturnValue(newVerification);
      verificationsRepository.save.mockResolvedValue(newVerification);

      const result = await service.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );

      expect(usersRepository.findOne).toBeCalledTimes(1);
      expect(usersRepository.findOne).toBeCalledWith({
        where: { id: editProfileArgs.userId },
      });

      expect(verificationsRepository.create).toBeCalledWith({
        user: newUser,
      });
      expect(verificationsRepository.save).toBeCalledWith(newVerification);

      expect(mailService.sendVerificationEmail).toBeCalledWith(
        newUser.email,
        newVerification.code,
      );
    });
  });

  it.todo('verifyEmail');
});