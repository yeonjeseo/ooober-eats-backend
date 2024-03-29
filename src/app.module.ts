import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/users.entity';
import { JwtModule } from './jwt/jwt.module';
import { jwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { Category } from './restaurants/entities/category.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TypeOrmExModule } from './restaurants/repositories/typeorm-ex.module';
import { CategoryRepository } from './restaurants/repositories/category.repository';
import { Dish } from './restaurants/entities/dish.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';

/**
 * forRoot?
 *  TypeORM module 안에 Restaurant라 하는 Entity를 가지고 있음
 */

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.test.env',
      ignoreEnvFile: process.env.Node_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required().valid('dev', 'test', 'prod'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        MAILGUN_URL: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),

    /**
     * Apollo Server 나 Graphql context 는 모든 resolver에 정보를 보낼 수 있는 Property
     * 모든 request에 대해서 context binding이 이뤄짐
     * context 속성의 함수 매개변수는 request
     */
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req }) => ({ user: req['user'] }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User,
        Verification,
        Restaurant,
        Category,
        Dish,
        Order,
        OrderItem,
      ],
      synchronize: process.env.NODE_ENV !== 'prod', // DB를 현재 모듈 상태로 동기화
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
    }),
    TypeOrmExModule.forCustomRepository([CategoryRepository]),
    JwtModule.forRoot({
      privateKey: process.env.JWT_SECRET,
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    AuthModule,
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
      emailDomain: process.env.MAILGUN_URL,
    }),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(jwtMiddleware).forRoutes({
      path: '/graphql', // graphql과 그 하위 경로에
      // path: '*', // 모든 경로에 (wild card)
      method: RequestMethod.ALL, // POST method인 경우에만 적용시킴
      // method: RequestMethod.ALL  // 모든 Method 에 대해 적용
    });
  }
}

/*
{
	"x-jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNjczMjM1OTU5fQ.nGFXD1muvjyLsjD8AV_kZflj9oJVrg6D1MDD1vv0usg"
}
 */