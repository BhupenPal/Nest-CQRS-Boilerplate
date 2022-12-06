import { Test, TestingModule } from '@nestjs/testing';
import { PrimaryDB } from './primary.service';

describe('PrimaryDB', () => {
  let service: PrimaryDB;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrimaryDB],
    }).compile();

    service = module.get<PrimaryDB>(PrimaryDB);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
