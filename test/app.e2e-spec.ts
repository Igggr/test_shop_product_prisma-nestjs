import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaClient],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);

    await prismaClient.$executeRaw`TRUNCATE "public"."Category" RESTART IDENTITY CASCADE;`;
  });

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  it('/category/create (POST)', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/category/create')
      .send({ name: 'tools' })
      .expect(HttpStatus.CREATED);

    
    expect(body).toMatchObject({
      id: 1,
      name: "tools",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
