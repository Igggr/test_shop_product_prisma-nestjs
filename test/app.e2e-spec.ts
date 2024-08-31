import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Prisma, PrismaClient } from '@prisma/client';
import { Currency } from 'src/common/enums';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaClient],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);


    await prismaClient.$executeRaw`TRUNCATE "public"."Product" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."Category" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."Price" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."StoreStock" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."Store" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."WarehouseStock" RESTART IDENTITY CASCADE;`;
  });

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);


  describe('categoryController', () => {
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
        .send({ name: 'hobbies' })
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
      await prismaClient.category.create({ data: { name: 'food' } });
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

  describe('productController', () => {
    it('/product/create (POST) without prices', async () => {
      const productBefore = await prismaClient.product.findMany();
      expect(productBefore).toEqual([]);

      const { body } = await request(app.getHttpServer())
        .post('/product/create')
        .send({ name: 'wtf', description: 'unknown object without prices' })
        .expect(HttpStatus.CREATED);


      expect(body).toMatchObject({
        id: 1,
        name: "wtf",
        description: 'unknown object without prices',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      const productAfter = await prismaClient.product.findMany(
        { include: { categories: true, storeStocks: true, prices: true, warehouseStocks: true } });
      expect(productAfter).toMatchObject([{
        id: 1,
        name: 'wtf',
        description: 'unknown object without prices',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        categories: [],
        storeStocks: [],
        prices: [],
        warehouseStocks: [],
      }]);
    });

    it('/product/create (POST) with prices', async () => {
      const productBefore = await prismaClient.product.findMany();
      expect(productBefore).toEqual([]);

      const { body } = await request(app.getHttpServer())
        .post('/product/create')
        .send({
          name: 'banana',
          description: 'yellow fruit',
          prices: [
            { currency: Currency.USD, amount: 1.1 },
            { currency: Currency.RUB, amount: 98 },
          ],

        })
        .expect(HttpStatus.CREATED);


      expect(body).toMatchObject({
        id: 1,
        name: 'banana',
        description: 'yellow fruit',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      const productAfter = await prismaClient.product.findMany(
        { include: { categories: true, storeStocks: true, prices: true, warehouseStocks: true } });

      expect(productAfter).toMatchObject([{
        id: 1,
        name: 'banana',
        description: 'yellow fruit',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        prices: [
          {
            currency: Currency.USD,
          },
          {
            currency: Currency.RUB,
          },
        ],
        categories: [],
        storeStocks: [],
        warehouseStocks: [],
      }]);

      expect(productAfter[0].prices[0].amount.toString()).toBe('1.1');
      expect(productAfter[0].prices[1].amount.toString()).toBe('98');
    });

    it('/product/getProduct/1 (GET)', async () => {
      const product = await prismaClient.product.create({ data: { name: 'T-shirt', description: 'L size. Blue color' } });
      await prismaClient.category.create({ data: { name: 'clothes', products: { connect: { id: product.id } } } });

      await prismaClient.price.create({ data: { currency: Currency.USD, amount: 7.5, product: { connect: { id: product.id } } } });
      await prismaClient.price.create({ data: { currency: Currency.RUB, amount: 630, product: { connect: { id: product.id } } } });

      await prismaClient.warehouseStock.create({ data: { quantity: 12, product: { connect: { id: product.id } } } });
      await prismaClient.warehouseStock.create({ data: { quantity: 31, product: { connect: { id: product.id } } } });

      const store1 = await prismaClient.store.create({ data: { name: 'store 1', location: 'Moscow' } });
      const store2 = await prismaClient.store.create({ data: { name: 'store 2', location: 'Spb' } });

      await prismaClient.storeStock.create({
        data: {
          quantity: 62,
          store: { connect: { id: store1.id } },
          product: { connect: { id: product.id } }
        }
      });

      await prismaClient.storeStock.create({
        data: {
          quantity: 104,
          store: { connect: { id: store2.id } },
          product: { connect: { id: product.id } }
        }
      })

      const { body } = await request(app.getHttpServer())
        .get('/product/getProduct/1')
        .expect(HttpStatus.OK);
      
      expect(body).toMatchObject({
        name: 'T-shirt',
        description: 'L size. Blue color',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        categories: [{
          id: 1,
          name: 'clothes',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }],
        prices: [
          {
            currency: Currency.USD,
            amount: '7.5'
          },
          {
            currency: Currency.RUB,
            amount: '630'
          },
        ],
        warehouseStocks: [
          {
            quantity: 12,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            quantity: 31,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
        storeStocks: [
          {
            id: 1,
            storeId: store1.id,
            quantity: 62,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: 2,
            storeId: store2.id,
            quantity: 104,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }
        ]
      })
    })

    it('/product/delete (DELETE)', async () => {
      await prismaClient.product.create({ data: { name: 'Xiaomi 11', description: 'smartphone 64/10 Gb' } });
      const productsBefore = await prismaClient.product.findMany({});
      expect(productsBefore).toMatchObject([{
        name: 'Xiaomi 11',
        description: 'smartphone 64/10 Gb',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }]);

      const { body } = await request(app.getHttpServer())
        .delete('/product/delete/1')
        .expect(HttpStatus.OK);
      
      const productsAfter = await prismaClient.product.findMany({});
      expect(productsAfter).toEqual([]);
    })
  });
});
