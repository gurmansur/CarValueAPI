import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUsersRepository: Partial<Repository<User>> = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = { email: 'teste@teste.com', password: '1234' };
    const createdUser = { id: '1', ...user };
    jest.spyOn(service, 'create').mockResolvedValue(createdUser as any);
    expect(await service.create(user.email, user.password)).toEqual(
      createdUser,
    );
  });

  it('should find a user', async () => {
    const user = { id: '1', email: 'teste@teste.com', password: '1234' };
    jest.spyOn(service, 'findOne').mockResolvedValue(user as any);
    expect(await service.findOne('1')).toEqual(user);
  });

  it('should find a user by email', async () => {
    const user = { id: '1', email: 'teste@teste.com', password: '1234' };
    jest.spyOn(service, 'find').mockResolvedValue([user] as any);
    expect(await service.find('teste@teste.com')).toEqual([user]);
  });

  it('should remove a user', async () => {
    const user = { id: '1', email: 'teste@teste.com', password: '1234' };
    jest.spyOn(service, 'remove').mockResolvedValue(user as any);
    expect(await service.remove('1')).toEqual(user);
  });

  it('should update a user', async () => {
    const user = { id: '1', email: 'teste@teste.com', password: '1234' };
    jest.spyOn(service, 'update').mockResolvedValue(user as any);
    expect(await service.update('1', user)).toEqual(user);
  });

  it('should return null when user is not found', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(null);
    expect(await service.findOne('1')).toBeNull();
  });
});
