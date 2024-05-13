import { Test, TestingModule } from '@nestjs/testing';
import { SwitchesService } from './switches.service';

describe('SwitchesService', () => {
  let service: SwitchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwitchesService],
    }).compile();

    service = module.get<SwitchesService>(SwitchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
