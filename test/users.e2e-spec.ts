import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

const GRAPHQL_ENDPOINT = '/graphql';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
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
    const EMAIL = 'goatyeonje@gmail.com';
    it('should create account', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
  createAccount(input:{
    email:"${EMAIL}"
    password: "12345"
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

    it.todo('should fail on exception');
  });

  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');
});