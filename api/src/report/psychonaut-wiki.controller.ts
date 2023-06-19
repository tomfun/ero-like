import { Controller, Get, Param } from '@nestjs/common';
import { PsychonautWikiService } from './psychonaut-wiki.service';

@Controller('/api/psychonautwiki')
export class PsychonautWikiController {
  constructor(private readonly wikiService: PsychonautWikiService) {}

  @Get('/substance')
  async getSubstanceList() {
    return this.wikiService.getShortList();
  }

  @Get('/substance/:name')
  async getSubstance(@Param('name') name: string) {
    return this.wikiService.getSubstance(name);
  }
}
