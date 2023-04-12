import { BadRequestException, Controller, Post } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { InvalidDataError } from './gpg.service';
import { ImportAndVerifyPayload } from './verify.payload';
import {
  NotAcceptAgreementError,
  UserCreateError,
  UserService,
} from './user.service';
import { ValidBody } from '../validBodyPipe';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/dry-run')
  async postUserDryRun(
    @ValidBody
    importAndVerifyDto: ImportAndVerifyPayload,
  ) {
    try {
      const data = await this.userService.createUserDryRun(importAndVerifyDto);
      return instanceToPlain(data.user, { groups: ['user'] });
    } catch (e) {
      this.convertUserRegisterError(e);
      throw e;
    }
  }

  @Post()
  async postUser(
    @ValidBody
    importAndVerifyDto: ImportAndVerifyPayload,
  ) {
    try {
      return instanceToPlain(
        await this.userService.createUser(importAndVerifyDto),
        { groups: ['user'] },
      );
    } catch (e) {
      this.convertUserRegisterError(e);
    }
  }
  private convertUserRegisterError(e: Error): never {
    if (
      e instanceof InvalidDataError ||
      e instanceof NotAcceptAgreementError ||
      e instanceof UserCreateError
    ) {
      throw new BadRequestException(e.message);
    }
    throw e;
  }
}
