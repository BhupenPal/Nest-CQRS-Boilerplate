import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsDB } from './analytics.service';

describe('AnalyticsDB', () => {
  let service: AnalyticsDB;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsDB],
    }).compile();

    service = module.get<AnalyticsDB>(AnalyticsDB);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
