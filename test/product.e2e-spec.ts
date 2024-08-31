import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import * as request from 'supertest';
import { AppModule } from "src/app.module";

describe('ProductController (e2e)', () => {
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
    });

    afterAll(async () => {
        await app.close();
        await prismaClient.$disconnect();
    }, 30000);

    it('/product/create (POST)', async () => {
        const productBefore = await prismaClient.product.findMany();
        expect(productBefore).toEqual([]);

        const { body } = await request(app.getHttpServer())
            .post('/product/create')
            .send({ name: 'wtf', description: 'unknown object without categories' })
            .expect(HttpStatus.CREATED);


        expect(body).toMatchObject({
            id: 1,
            name: "wtf",
            description: 'unknown object without categories',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });

        const productAfter = await prismaClient.product.findMany(
            { include: { categories: true, storeStocks: true, price: true, warehouseStocks: true } });
        expect(productAfter).toMatchObject([{
            id: 1,
            name: 'wtf',
            description: 'unknown object without categories',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            categories: [],
            storeStocks: [],
            price: [],
            warehouseStocks: [],
        }]);
    });
})