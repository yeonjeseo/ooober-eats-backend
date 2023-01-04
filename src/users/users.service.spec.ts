import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UserService', () => {
  let service: UsersService;

  /**
   * 모든 테스트 케이스에 대해 테스트 모듈 생성
   */
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('createAccount');
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});