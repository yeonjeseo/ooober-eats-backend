import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { DataSource, Repository } from 'typeorm';
import * as request from 'supertest';
import { User } from '../src/users/entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

// jest.mock('got', () => ({
//   post: jest.fn,
// }));
jest.mock('got');

const GRAPHQL_ENDPOINT = '/graphql';
const EMAIL = 'goatyeonje@gmail.com';
const PASSWORD = '12345';

const testUser = {
  email: EMAIL,
  password: PASSWORD,
};
describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let usersRepository: Repository<User>;

  /**
   * AppModule 전체를 import
   */
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await app.init();
  });
  afterAll(async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    const connection = await dataSource.initialize();
    await connection.dropDatabase();
    await connection.destroy();

    await app.close();
  });

  // it.todo('createAccount');
  describe('createAccount', () => {
    it('should create account', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input:{
              email:"${testUser.email}"
              password: "${testUser.password}"
              role:Client
            }) {
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });

    it('should fail should fail if account already exists', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input:{
              email:"${testUser.email}"
              password: "${testUser.password}"
              role:Client
            }) {
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toEqual(
            'There is a user with that email already',
          );
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', async () =>
      request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation {
          login(input: {
            email: "${testUser.email}"
            password: "${testUser.password}"
          }) {
            ok
            error
            token
          }
        }
      `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;

          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));

          // 테스트 케이스에 걸쳐 재사용하기 위해
          jwtToken = login.token;
        }));

    it('should not be able to login with wrong credentials', () =>
      request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation {
          login(input: {
            email: "${testUser.email}"
            password: "asdasd"
          }) {
            ok
            error
            token
          }
        }
      `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;

          expect(login.ok).toBe(false);
          expect(login.error).toBe('Wrong password!');
          expect(login.token).toBe(null);
        }));
  });

  describe('userProfile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await usersRepository.find();
      userId = user.id;
    });

    it("should see a user's profile", () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `
          {
            userProfile(userId: ${userId}) {
                ok
                error
                user {
                  id
                }
              }
            }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: {
                  ok,
                  error,
                  user: { id },
                },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(id).toBe(userId);
        });
    });

    it('should not find a profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `
          {
            userProfile(userId: 123123) {
                ok
                error
                user {
                  id
                }
              }
            }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: { ok, error, user },
              },
            },
          } = res;
          // console.log(res.body);
          expect(ok).toBe(false);
          expect(error).toBe('User not found');
          expect(user).toBe(null);
        });
    });
  });

  describe('me', () => {
    it('should find my profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `{
                    me {
                      email
                    }
                  }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(testUser.email);
        });
    });

    it('should not allow logged out user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          {
            userProfile(userId: 123123) {
                ok
                error
                user {
                  id
                }
              }
            }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: { errors, data },
          } = res;
          const [error] = errors;
          expect(error.message).toBe('Forbidden resource');
        });
    });
  });
  it.todo('verifyEmail');
  it.todo('editProfile');
});