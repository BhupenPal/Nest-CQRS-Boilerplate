import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { PrimaryDB } from '@app/database';
import { argon2id, hash } from 'argon2';
import { customAlphabet } from 'nanoid/async';
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
      // SENDING FALSE POSITIVE RESPONSE
      return {
        statusCode: 201,
        message: 'User created successfully.',
      };
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

    return user;
  }

  private createHash(password: string) {
    return hash(password, { type: argon2id });
  }

  private async generateUserName(givenName: string, familyName: string) {
    const alphabet =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-';

    const uuid = await customAlphabet(alphabet, 14)();

    return `${Math.floor(Math.random() * 2) ? familyName : givenName}`
      .concat('-')
      .concat(uuid)
      .replace(/[^a-zA-Z0-9]/gi, '-');
  }

  private checkBadDomains(email: string) {
    const domain = email.split('@')[1];

    return this.primaryDB.badDomain.findUnique({
      where: {
        name: domain,
      },
    });
  }

  private checkBadKeywords(givenName: string, familyName: string) {
    // MAKE SURE ALL RESERVED KEYWORDS TO BE LOWERCASE
    const reservedKeywords = [
      'about',
      'maintenance',
      'profile',
      'promote',
      'user',
      'website',
    ];

    // MAKE SURE ALL BAD KEYWORDS TO BE LOWERCASE
    const badKeywords = [
      'abortion pill',
      'abortion pills',
      'abortion',
      'babe',
      'babes',
      'behenchod',
      'bhosdi',
      'bhosdike',
      'blow job',
      'blowjob',
      'boobs',
      'cal gal',
      'cal girl',
      'calgal',
      'calgalagency',
      'calgirl',
      'calgirlagency',
      'calgirlsagency',
      'call gal',
      'call gals',
      'call girl',
      'call girls',
      'callgal',
      'callgalagency',
      'callgirl',
      'callgirlagency',
      'callgirlsagency',
      'car baike',
      'car bike',
      'carbike',
      'celebrity escort',
      'celebrity escorts',
      'chubby',
      'cunt',
      'dating girls',
      'datinggal',
      'datinggals',
      'datinggirls',
      'esc*rt',
      'esc*rts',
      'esc0rt',
      'esc0rts',
      'escort service',
      'escort',
      'escorts service',
      'escortx',
      'fak me',
      'false',
      'fuck',
      'fuckk',
      'girl',
      'girls',
      'high profile',
      'highprofile',
      'illuminati',
      'ma ke lode',
      'maa ke lode',
      'madarchod',
      'massage',
      'nude',
      'nudes',
      'porn hub',
      'porn',
      'pornhub',
      'powerful spell caster',
      'premium',
      'princess',
      'romance',
      'service',
      'sex',
      'sextoy',
      'sextoys',
      'sexy',
      'spell caster',
      'true',
      'xvideos',
    ];

    givenName = givenName.toLowerCase();
    familyName = familyName.toLowerCase();

    if (
      reservedKeywords.includes(givenName) ||
      reservedKeywords.includes(familyName) ||
      badKeywords.includes(givenName) ||
      badKeywords.includes(familyName) ||
      badKeywords.includes(`${givenName} ${familyName}`)
    ) {
      return true;
    }

    return false;
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
