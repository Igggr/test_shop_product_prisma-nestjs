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
    const categoriesBefore = await prismaClient.category.findMany();
    expect(categoriesBefore).toEqual([]);

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

    const categoriesAfter = await prismaClient.category.findMany({ include: { products: true } });
    expect(categoriesAfter).toMatchObject([{
      id: 1,
      name: 'tools',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      products: [],
    }]);
  });

  it('/category/getCategory (GET)', async () => {
    await prismaClient.category.create({ data: { name: 'clothes' } });
    const categoriesBefore = await prismaClient.category.findMany({ include: { products: true } });
    expect(categoriesBefore).toMatchObject([{
      id: 1,
      name: 'clothes',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      products: [],
    }]);

    const { body } = await request(app.getHttpServer())
      .get('/category/getCategory/1')
      .expect(HttpStatus.OK);
    
    expect(body).toMatchObject({
      id: 1,
      name: "clothes",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    const categoriesAfter = await prismaClient.category.findMany({ include: { products: true } });
    expect(categoriesAfter).toMatchObject([{
      id: 1,
      name: 'clothes',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      products: [],
    }]);
  });

  it('/category/updateCategory (PUT)', async () => {
    await prismaClient.category.create({ data: { name: 'sport' } });
    const categoriesBefore = await prismaClient.category.findMany({ include: { products: true } });
    expect(categoriesBefore).toMatchObject([{
      id: 1,
      name: 'sport',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      products: [],
    }]);

    const { body } = await request(app.getHttpServer())
      .put('/category/updateCategory/1')
      .send({name: 'hobbies'})
      .expect(HttpStatus.OK);

    const categoriesAfter = await prismaClient.category.findMany({ include: { products: true } });
    expect(categoriesAfter).toMatchObject([{
      id: 1,
      name: 'hobbies',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      products: [],
    }]);
  });

  it('/category/delete (DELETE)', async () => {
    await prismaClient.category.create({ data: { name: 'food'}});
    const categoriesBefore = await prismaClient.category.findMany({ include: { products: true } });
    expect(categoriesBefore).toMatchObject([{
      id: 1,
      name: 'food',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      products: [],
    }]);


    const { body } = await request(app.getHttpServer())
      .delete('/category/delete/1')
      .expect(HttpStatus.OK);

    const categoriesAfter = await prismaClient.category.findMany();
    expect(categoriesAfter).toEqual([]);
  });
});
