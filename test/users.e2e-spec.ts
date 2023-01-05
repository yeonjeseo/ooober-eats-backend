import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

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
  /**
   * AppModule 전체를 import
   */
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
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

  it.todo('userProfile');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');
});