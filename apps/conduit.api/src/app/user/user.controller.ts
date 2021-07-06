import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserCreateCommand } from './commands/user-create/user-create.command';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { UserCreateInputEnvelope } from './dtos/user-create-input-envelop.dto';
import { UserCreateInput } from './dtos/user-create-input.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  /**
   * Registration.
   */
  @Post()
  async createUser(@Body() userCreateInputEnvelope: UserCreateInputEnvelope) {
    const command = this.mapper.map(
      userCreateInputEnvelope.user,
      UserCreateCommand,
      UserCreateInput,
    );
    const result = await this.commandBus.execute(command);
    return result;
  }

  // Authentication.
  // @Post('users/login')
  // async postUsersLogin(@Req() request: Request) {
  //     return this.service.loginUser(request.body.user);
  // }
  // /**
  //  * Get current user.
  //  */
  // @Get('user')
  // async user(@AuthorizationToken() token: string) {
  //     return this.service.getCurrentUser(token);
  // }
}
