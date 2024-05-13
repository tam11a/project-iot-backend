import { Test, TestingModule } from '@nestjs/testing';
import { SwitchesController } from './switches.controller';
import { SwitchesService } from './switches.service';

describe('SwitchesController', () => {
  let controller: SwitchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwitchesController],
      providers: [SwitchesService],
    }).compile();

    controller = module.get<SwitchesController>(SwitchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
