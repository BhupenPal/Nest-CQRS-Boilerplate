import { Injectable } from '@nestjs/common';
import { PrimaryDB } from '@app/database';

@Injectable()
export class UserRepository {
  constructor(private readonly primaryDB: PrimaryDB) {}

  get findFirst() {
    return this.primaryDB.user.findFirst;
  }

  get findFirstOrThrow() {
    return this.primaryDB.user.findFirstOrThrow;
  }
}
