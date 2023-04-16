import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { UUID_V4_REGEX } from '../consts';
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

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Find by parameter id not provided');
    }
    if (!id.match(UUID_V4_REGEX)) {
      throw new BadRequestException(
        'Find by parameter id contain special characters',
      );
    }
    return instanceToPlain(await this.userService.getUser(id), {
      groups: ['user'],
    });
  }

  @Post('/dry-run')
  @HttpCode(HttpStatus.OK)
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
