import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;
  let agent: request.SuperTest<request.Test>;
  let idCreated = null;
  let userService: UsersService;
  const userSend = {
    email: 'Oliver@ddk.ru',
    firstName: 'dldld',
    lastName: 'dkdk',
  };
  const idProduct = '657cddc2ef6aa320ec91de82';

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    userService = moduleRef.get<UsersService>(UsersService);
    agent = request(app.getHttpServer());
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('Get users list GET 200', () => {
    return agent.get(`/users`).expect(200);
  });

  it('Post user', async () => {
    const userCreated = await agent.post(`/users`).send(userSend);
    idCreated = userCreated.body._id;
    expect(userCreated.status).toEqual(201);
  });

  it('Get user', async () => {
    const userCreated = await agent.get(`/users/${idCreated}`);
    expect(userCreated.body).toMatchObject(userSend);
    expect(userCreated.status).toEqual(200);
  });

  it('Delete user', async () => {
    const userDeleted = await agent.delete(`/users/${idCreated}`);
    const res = await userService.deletePermit(idCreated);
    expect(res._id.toString()).toEqual(idCreated);
    expect(userDeleted.status).toEqual(200);
  });

  it('Get user 400', async () => {
    const userCreated = await agent.get(`/users/${idCreated}`);
    expect(userCreated.statusCode).toEqual(404);
  });

  it('Put user history', async () => {
    const userCreated = await agent.post(`/users`).send(userSend);
    await agent.post(`/users/history`).send({
      idUser: userCreated.body._id,
      idProduct,
    });
    const user = await agent.get(`/users/${userCreated.body._id}`);
    await userService.deletePermit(userCreated.body._id);

    expect(user.body.productsId).toContain(idProduct + 'd');
  });
});
