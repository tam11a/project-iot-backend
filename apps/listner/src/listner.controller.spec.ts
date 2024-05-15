import { Test, TestingModule } from '@nestjs/testing';
import { ListnerController } from './listner.controller';
import { ListnerService } from './listner.service';

describe('ListnerController', () => {
  let listnerController: ListnerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ListnerController],
      providers: [ListnerService],
    }).compile();

    listnerController = app.get<ListnerController>(ListnerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(listnerController.getHello()).toBe('Hello World!');
    });
  });
});
