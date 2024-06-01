import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: string) =>
        Promise.resolve({
          id,
          email: 'teste@teste.com',
          password: '1234',
        } as User),
      find: (email: string) =>
        Promise.resolve([
          {
            id: '781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d',
            email,
            password: '1234',
          } as User,
        ]),
      remove: (id: string) =>
        Promise.resolve({
          id,
          email: 'teste@teste.com',
          password: '1234',
        } as User),
      update: (id: string, user: Partial<User>) =>
        Promise.resolve({ id, ...user } as User),
    };

    fakeAuthService = {
      signUp: (email: string, password: string) => {
        return Promise.resolve({
          id: '781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d',
          email,
          password,
        } as User);
      },
      signIn: (email: string, password: string) => {
        return Promise.resolve({
          id: '781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d',
          email,
          password,
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findUsers('teste@teste.com');
    expect(users).toHaveLength(1);
    expect(users[0].email).toEqual('teste@teste.com');
  });

  it('findUser returns a single user with the given uuid', async () => {
    const user = await controller.findUser(
      '781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d',
    );
    expect(user).toBeDefined();
    expect(user.id).toEqual('781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d');
  });

  it('findUser throws an error if the user is not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('non-existent-id')).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('updateUser returns the updated user', async () => {
    const updatedUser = await controller.updateUser(
      '781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d',
      { email: 'teste@teste.com', password: '1234' },
    );
    expect(updatedUser.id).toEqual('781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d');
  });

  it('removeUser returns the removed user', async () => {
    const removedUser = await controller.removeUser(
      '781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d',
    );
    expect(removedUser.id).toEqual('781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d');
  });

  it('signIn updates the session object and returns the user', async () => {
    const session = { userId: null };
    const user = await controller.signin(
      { email: 'teste@teste.com', password: '1234' },
      session,
    );
    expect(user.id).toEqual('781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d');
    expect(session.userId).toEqual('781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d');
  });

  it('signUp updates the session object and returns the user', async () => {
    const session = { userId: null };
    const user = await controller.createUser(
      { email: 'teste@teste.com', password: '1234' },
      session,
    );
    expect(user.id).toEqual('781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d');
    expect(session.userId).toEqual('781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d');
  });

  it('signOut clears the userId from the session object', () => {
    const session = { userId: '781c7f4c-4f4b-4b1e-8f0c-0c0f7b5f7b1d' };
    controller.signOut(session);
    expect(session.userId).toBeNull();
  });
});
