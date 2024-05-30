import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    // Check if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email já cadastrado');
    }

    // Hash the user's password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hash result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.usersService.create(email, result);

    // Return the user
    return user;
  }

  async signIn(email: string, password: string) {
    // Find the user in the database
    const [user] = await this.usersService.find(email);

    // If the user is not found
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Split the salt and the hashed password
    const [salt, storedHash] = user.password.split('.');

    // Hash the inserted password with the stored salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //Check if inserted password hash is equal to stored hash
    if (storedHash === hash.toString('hex')) {
      return user;
    } else {
      throw new BadRequestException('Senha incorreta');
    }
  }
}
