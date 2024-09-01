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

    await prismaClient.$executeRaw`TRUNCATE "public"."_CategoryToProduct" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."WarehouseStock" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."StoreStock" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."Store" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."Category" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."Price" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."Product" RESTART IDENTITY CASCADE;`;
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
      const product = await prismaClient.product.create({ data: { name: 'T-shirt', description: 'L size. Blue color' } });
      await prismaClient.category.create({ data: { name: 'clothes', products: { connect: { id: product.id } } } });

      const categoriesBefore = await prismaClient.category.findMany({ include: { products: true } });
      expect(categoriesBefore).toMatchObject([{
        id: 1,
        name: 'clothes',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        products: [
          {
            id: 1,
            name: 'T-shirt',
            description: 'L size. Blue color',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          }
        ],
      }]);

      const { body } = await request(app.getHttpServer())
        .get('/category/getCategory/1')
        .expect(HttpStatus.OK);
    
      expect(body).toMatchObject({
        id: 1,
        name: "clothes",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        products: [
          {
            id: 1,
            name: 'T-shirt',
            description: 'L size. Blue color',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }
        ]
      });

      const categoriesAfter = await prismaClient.category.findMany({ include: { products: true } });
      expect(categoriesAfter).toMatchObject([{
        id: 1,
        name: 'clothes',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        products: [
          {
            id: 1,
            name: 'T-shirt',
            description: 'L size. Blue color',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          }
        ],
      }]);
    });

    it('/category/updateCategory (PUT)', async () => {
      const category = await prismaClient.category.create({ data: { name: 'sport' } });
      const categoryBeforeUpdate = await prismaClient.category.findUniqueOrThrow({where: { id: category.id }});
      expect(categoryBeforeUpdate).toMatchObject({
        id: 1,
        name: 'sport',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const { body } = await request(app.getHttpServer())
        .put('/category/updateCategory/1')
        .send({ name: 'hobbies' })
        .expect(HttpStatus.OK);

      const categoryAfterUpdate = await prismaClient.category.findUniqueOrThrow({ where: { id: category.id } });
      expect(categoryAfterUpdate).toMatchObject({
        id: 1,
        name: 'hobbies',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(categoryBeforeUpdate.createdAt).toEqual(categoryAfterUpdate.createdAt);
      expect(categoryBeforeUpdate.updatedAt).not.toEqual(categoryAfterUpdate.updatedAt);
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

    it('/product/updateProduct/1 (PUT)', async () => {
      const product = await prismaClient.product.create({ data: { name: 'Last iphone', description: 'it is last model. buy!!!' } });

      const productBeforeUpdate = await prismaClient.product.findUniqueOrThrow({ where: { id: product.id } });
      expect(productBeforeUpdate).toMatchObject({
        id: product.id,
        name: 'Last iphone',
        description: 'it is last model. buy!!!',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      const { body } = await request(app.getHttpServer())
        .put('/product/updateProduct/1')
        .send({ name: 'Not a last model anymore', description: ':(((' })
        .expect(HttpStatus.OK);

      const productAfterUpdate = await prismaClient.product.findUniqueOrThrow({ where: { id: product.id } });
      expect(productAfterUpdate).toMatchObject({
        name: 'Not a last model anymore',
        description: ':(((',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });

      expect(productBeforeUpdate.createdAt).toEqual(productAfterUpdate.createdAt);
      expect(productBeforeUpdate.updatedAt).not.toEqual(productAfterUpdate.updatedAt);
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

  describe('storeController', () => {
    it('/store/create (POST)', async () => {
      const storesBefore = await prismaClient.store.findMany();
      expect(storesBefore).toEqual([]);

      const { body } = await request(app.getHttpServer())
        .post('/store/create')
        .send({ name: 'store 1', location: 'Moscow' })
        .expect(HttpStatus.CREATED);
      
      expect(body).toMatchObject({
        id: 1,
        name: 'store 1',
        location: 'Moscow',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      
      const storesAfter = await prismaClient.store.findMany();
      expect(storesAfter).toEqual([{
        id: 1,
        name: 'store 1',
        location: 'Moscow',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }]);
      
    });

    it('/store/getStore/1 (GET)', async () => {
      const store = await prismaClient.store.create({ data: { name: 'store1', location: 'Moscow' } });

      const tShirt = await prismaClient.product.create({ data: { name: 'T-shirt', description: 'L size. Blue color' } });
      const phone = await prismaClient.product.create({ data: { name: 'Last iphone', description: 'it is last model. buy!!!' } });

      await prismaClient.price.create({ data: { currency: Currency.USD, amount: 7.5, product: { connect: { id: tShirt.id } } } });
      await prismaClient.price.create({ data: { currency: Currency.RUB, amount: 630, product: { connect: { id: tShirt.id } } } });

      await prismaClient.price.create({ data: { currency: Currency.USD, amount: 800, product: { connect: { id: phone.id } } } });
      await prismaClient.price.create({ data: { currency: Currency.RUB, amount: 75000, product: { connect: { id: phone.id } } } });

      await prismaClient.storeStock.create({
        data: {
          quantity: 23,
          store: { connect: { id: store.id } },
          product: { connect: { id: tShirt.id }}
        }
      });

      await prismaClient.storeStock.create({
        data: {
          quantity: 17,
          store: { connect: { id: store.id } },
          product: { connect: { id: phone.id } }
        }
      });


      const { body } = await request(app.getHttpServer())
        .get('/store/getStore/1')
        .expect(HttpStatus.OK);

      expect(body).toMatchObject({
        id: 1,
        name: 'store1',
        location: 'Moscow',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        storeStocks: [
          {
            id: 1,
            productId: tShirt.id,
            quantity: 23,
            storeId: store.id,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            product: {
              id: tShirt.id,
              description: "L size. Blue color",
              name: "T-shirt",
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              prices: [
                {
                  id: expect.any(Number),
                  currency: Currency.USD,
                  amount: '7.5',
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  id: expect.any(Number),
                  currency: Currency.RUB,
                  amount: '630',
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                }
              ]
            }
          },
          {
            id: 2,
            productId: phone.id,
            quantity: 17,
            storeId: store.id,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            product: {
              id: phone.id,
              name: 'Last iphone',
              description: 'it is last model. buy!!!',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              prices: [
                {
                  id: expect.any(Number),
                  amount: '800',
                  currency: Currency.USD,
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  id: expect.any(Number),
                  amount: '75000',
                  currency: Currency.RUB,
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                }
              ]
            }
          }
        ]
      })
    })

    it('/store/setProductRemainingQuantity (PUT)', async () => {
      const store = await prismaClient.store.create({ data: { name: 'store1', location: 'Moscow' } });

      const tShirt = await prismaClient.product.create({ data: { name: 'T-shirt', description: 'L size. Blue color' } });
      
      await prismaClient.storeStock.create({
        data: {
          quantity: 45,
          store: { connect: { id: store.id } },
          product: { connect: { id: tShirt.id } }
        }
      });

      const { body } = await request(app.getHttpServer())
        .put('/store/setProductRemainingQuantity')
        .send({ productId: 1, storeId: 1, newQuantity: 42 })
        .expect(HttpStatus.OK);
      
      const storeStock = await prismaClient.storeStock.findUniqueOrThrow({ where: { productId_storeId: { productId: tShirt.id, storeId: store.id } } });
      expect(storeStock).toMatchObject({
        id: expect.any(Number),
        quantity: 45,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        storeId: store.id,
        productId: tShirt.id,
      });
    });

    it('/store/setProductPrice (POST) update existing', async () => {
      const tShirt = await prismaClient.product.create({ data: { name: 'T-shirt', description: 'L size. Blue color' } });
      await prismaClient.price.create({ data: { currency: Currency.USD, amount: 7.5, product: { connect: { id: tShirt.id } } } });

      const { body } = await request(app.getHttpServer())
        .post('/store/setProductPrice')
        .send({ productId: 1, currency: Currency.USD, amount: 10.5 })
        .expect(HttpStatus.OK);
      
      const prices = await prismaClient.price.findMany({ where: { productId: tShirt.id } });
      expect(prices.length).toBe(1);

      expect(prices[0].amount.toString()).toBe('10.5');
    });

    it('/store/setProductPrice (POST) add new price', async () => {
      const tShirt = await prismaClient.product.create({ data: { name: 'T-shirt', description: 'L size. Blue color' } });

      const { body } = await request(app.getHttpServer())
        .post('/store/setProductPrice')
        .send({ productId: 1, currency: Currency.USD, amount: 9.5 })
        .expect(HttpStatus.OK);

      const prices = await prismaClient.price.findMany({ where: { productId: tShirt.id } });
      expect(prices.length).toBe(1);

      expect(prices[0].amount.toString()).toBe('9.5');
    });

  });
});
