import { Injectable } from '@nestjs/common';

export interface ReportForList {
  id: string;
  substances: Array<{
    name: string;
    activeSubstance: string;
    sure: number;
  }>;
  title: string;
  nick: string;
  gpgSigned: boolean;
}

export interface Paginable<Entity> {
  items: Entity[];
  page: number;
  pageSize: number;
  itemsTotal: number;
}

@Injectable()
export class ReportService {
  getList(): Paginable<ReportForList> {
    return {
      items: [
        {
          id: '3422b448-2460-4fd2-9183-8000de6f8343',
          gpgSigned: false,
          substances: [{ name: 'Xtc', activeSubstance: 'MDMA', sure: 90 }],
          nick: 'tomfun',
          title: 'Было весело'
        },
        {
          id: '3442b458-2660-4fd2-9173-8000de6f8343',
          gpgSigned: false,
          substances: [{ name: 'LSD', activeSubstance: 'LSD', sure: 95 }],
          nick: 'tomfun',
          title: 'Было не очень весело'
        },
        {
          id: '5424b448-2450-4fd2-9883-8000de6f8343',
          gpgSigned: false,
          substances: [{ name: 'Хмурый', activeSubstance: 'heroin', sure: 70 }],
          nick: 'tomfun',
          title: 'Теперь, я подсел',
        },
      ],
      itemsTotal: 3,
      page: 1,
      pageSize: 10,
    };
  }

  create(createReportDto: ReportForList): ReportForList {
    console.log('todo: create creation');
    return createReportDto;
  }
}
