import { Test, TestingModule } from '@nestjs/testing';
import { PaginationQueryDto } from '../core/paginationQueryPipe';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

describe('AppController', () => {
  let appController: ReportController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [ReportService],
    }).compile();

    appController = app.get<ReportController>(ReportController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(
        appController.getReports(new PaginationQueryDto(), new ReportFilters()),
      ).toBe('Hello World!');
    });
  });
});
