import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './users.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  create(email: string, password: string): Promise<User> {
    const user = this.usersRepository.create({ email, password });
    return this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    if (!id) {
      return null;
    }
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async find(email: string): Promise<User[]> {
    return await this.usersRepository.find({ where: { email } });
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.usersRepository.remove(user);
  }

  async update(id: string, user: Partial<UpdateUserDto>): Promise<User> {
    const updatedUser = await this.findOne(id);
    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado');
    }
    Object.assign(updatedUser, user);
    return this.usersRepository.save(updatedUser);
  }
}
