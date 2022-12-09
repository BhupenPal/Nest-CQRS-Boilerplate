import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { PrimaryDB } from '@app/database';
import { argon2id, hash } from 'argon2';
import { nanoid } from 'nanoid/async';
import { UserCreatedEvent } from '../../events/impl/user-created.event';
import { CreateUserCommand } from '../impl/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly primaryDB: PrimaryDB,
  ) {}

  public async execute(command: CreateUserCommand): Promise<any> {
    const { givenName, familyName, email, password } = command;

    const passwordStrength = this.checkPasswordStrength(password);

    if (passwordStrength === 'low') {
      throw new BadRequestException('Please enter a strong password.');
    }

    const containsBadKeywords = this.checkBadKeywords(givenName, familyName);

    if (containsBadKeywords) {
      throw new BadRequestException('Request contains bad words.');
    }

    const [hashedPassword, userName, isBadDomain] = await Promise.all([
      this.createHash(password),
      this.generateUserName(givenName, familyName),
      this.checkBadDomains(email),
    ]);

    if (isBadDomain) {
      throw new BadRequestException('Invalid email domain.');
    }

    const user = await this.primaryDB.user.create({
      data: {
        email: email,
        givenName: givenName,
        familyName: familyName,
        password: hashedPassword,
        userName: userName,
      },
    });

    this.eventBus.publish(new UserCreatedEvent(user.id));
  }

  private createHash(password: string) {
    return hash(password, { type: argon2id });
  }

  private async generateUserName(givenName: string, familyName: string) {
    const uuid = await nanoid(14);

    return `${Math.floor(Math.random() * 2) ? familyName : givenName}`
      .concat('-')
      .concat(uuid)
      .replace(/[^a-zA-Z0-9]/gi, '-');
  }

  private async checkBadDomains(email: string) {
    return false;
  }

  private checkBadKeywords(givenName: string, familyName: string) {
    return true;
  }

  private checkPasswordStrength(password: string) {
    const strongPasswordRegex = new RegExp(
      '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})',
    );

    if (strongPasswordRegex.test(password)) {
      return 'strong';
    }

    const mediumPasswordRegex = new RegExp(
      '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))',
    );

    if (mediumPasswordRegex.test(password)) {
      return 'strong';
    }

    return 'low';
  }
}
