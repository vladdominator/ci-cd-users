import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UserType } from './user.dto';
import { Model, Query } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

const mockUser = (
  email = 'user@gmail.com',
  _id = 'a uuid',
  lastName = 'Lastname',
  firstName = 'Firstname',
  isValid = false,
  role = 'bi',
  productsId = [],
): UserType => ({
  email,
  _id,
  lastName,
  firstName,
  isValid,
  role,
  productsId,
});

const mockUserDoc = (mock?: Partial<UserType>): Partial<UserType> => ({
  email: mock?.email || 'user@gmail.com',
  _id: mock?._id || 'a uuid',
  lastName: mock?.lastName || 'Lastname',
  firstName: mock?.firstName || 'Firstname',
  isValid: mock?.isValid || false,
  role: mock?.role || 'bi',
  productsId: mock?.productsId || [],
});

const userArray = [
  mockUser(),
  mockUser(
    'Vladislav@dkdk.ru',
    'a new uuid',
    'Zhilinsk',
    'Vladislav',
    true,
    'developer',
    ['dkkd'],
  ),
  mockUser('Simba@dkdk.ru', 'the king', 'FEE', 'Simba', false, 'lead', [
    '2',
    '3',
  ]),
];

const userDocArray: Partial<UserType>[] = [
  mockUserDoc(),
  mockUserDoc({
    email: 'Vladislav@dkdk.ru',
    _id: 'a new uuid',
    lastName: 'Zhilinsk',
    firstName: 'Vladislav',
    isValid: true,
    role: 'developer',
    productsId: ['dkkd'],
  }),
  mockUserDoc({
    email: 'Simba@dkdk.ru',
    _id: 'the king',
    lastName: 'FEE',
    firstName: 'Simba',
    isValid: false,
    role: 'lead',
    productsId: ['2', '3'],
  }),
];

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('Users'),
          // notice that only the functions we call from the model are mocked
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserType>>(getModelToken('Users'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(userDocArray),
    } as unknown as Query<UserType[], UserType>);
    const users = await service.findAll();
    expect(users).toEqual(userArray);
  });

  it('should getOne by id', async () => {
    jest.spyOn(model, 'findById').mockResolvedValueOnce(
      mockUserDoc({
        email: 'Ventus',
        _id: '657d4e446f5d270d497d4299',
        lastName: 'Lastname',
        firstName: 'FirstName',
        isValid: true,
      }),
    );
    const findMockUser = mockUser(
      'Ventus',
      '657d4e446f5d270d497d4299',
      'Lastname',
      'FirstName',
      true,
    );
    const foundUser = await service.findById('657d4e446f5d270d497d4299');
    expect(foundUser).toEqual(findMockUser);
  });

  it('should get error id', async () => {
    jest.spyOn(model, 'findById').mockResolvedValueOnce(
      mockUserDoc({
        email: 'Ventus',
        _id: 'dd',
      }),
    );
    try {
      await service.findById('dd');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.response.message).toEqual('Invalid id');
    }
  });

  it('should insert a new user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(
      () =>
        Promise.resolve({
          email: 'Oliver@ddk.ru',
          firstName: 'dldld',
          lastName: 'dkdk',
          _id: 'some id',
          isValid: false,
          productsId: [],
          role: 'bi',
        }) as any,
    );
    const newUser = await service.create({
      email: 'Oliver@ddk.ru',
      firstName: 'dldld',
      lastName: 'dkdk',
    });
    expect(newUser).toEqual(
      mockUser('Oliver@ddk.ru', 'some id', 'dkdk', 'dldld'),
    );
  });
});
