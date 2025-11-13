import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';

@Injectable()
export class AppService {
  async getHello() {
    return { message: 'Hello World!!!', password: await hash('binson') };
  }
}
