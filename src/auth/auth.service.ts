import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersRepository } from './users.repository';
import { UserCredentialsDto } from './dtos/user-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

enum POSTGRES_ERROR_CODES {
  DUPLICATE_KEY_VALUE = '23505',
}

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userCredentials: UserCredentialsDto): Promise<void> {
    const { username, password } = userCredentials;

    const encryptedPassword = await this.encryptPassword(password);
    const user = this.usersRepository.create({
      username,
      password: encryptedPassword,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODES.DUPLICATE_KEY_VALUE:
          throw new ConflictException('Username already exists');
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    userCredentials: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = userCredentials;

    const user = await this.usersRepository.findOneBy({ username });
    if (!user) throw new BadRequestException('Invalid Credentials');

    const isValidPassword = await this.comparePassword(user.password, password);
    if (!isValidPassword) throw new BadRequestException('Invalid Credentials');

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  /**
   * @description Takes a string and returns an encrypted string in salt.hashed format
   * @param password
   * @returns Encrypted string
   */
  private async encryptPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hashed = (await scrypt(password, salt, 32)) as Buffer;
    return `${salt}.${hashed.toString('hex')}`;
  }

  /**
   * @description Takes an encrypted and input string to compare if their hashes are equal
   * @param encryptedPassword
   * @param inputPassword
   * @returns boolean
   */
  private async comparePassword(
    encryptedPassword: string,
    inputPassword: string,
  ): Promise<boolean> {
    const [salt, hashed] = encryptedPassword.split('.');
    const hashedCompare = (await scrypt(inputPassword, salt, 32)) as Buffer;
    return hashed === hashedCompare.toString('hex');
  }
}
