import { Test, TestingModule } from '@nestjs/testing';
import { TypeSymbol } from 'ero-like-sdk/dist/filters-query.pipe';
import { PaginationQueryDto } from '../core/pagination-query.pipe';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

describe('AppController', () => {
  let appController: ReportController;
  const reportService = {
    getList: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [ReportService],
    })
      .overrideProvider(ReportService)
      .useValue(reportService)
      .compile();

    appController = app.get<ReportController>(ReportController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const emptyFilters = {
        [TypeSymbol]: Object,
        signature: {
          [TypeSymbol]: Object,
          user: {
            [TypeSymbol]: Object,
            // id?: StringField;
            // nick?: StringField;
          },
        },

        d: {
          [TypeSymbol]: Object,
        },
      };
      const out = {};
      reportService.getList.mockResolvedValueOnce(out);
      expect(
        await appController.getReports(new PaginationQueryDto(), emptyFilters),
      ).toBe(out);
    });
  });
});
