import * as moment from 'moment';
import { Controller, Get, Query } from '@nestjs/common';

import { AppError } from 'src/hooks/checkError';
import { Proposal } from '../../entities/entities.entity';
import GetListProposalAdminService from 'src/services/admin/getListProposalAdmin.service';
import GetListUsersByDateAdminService from 'src/services/admin/getListUsersByDateAdmin.service';

@Controller()
export class AdminController {
  constructor(
    private readonly getListProposalAdminService: GetListProposalAdminService,
    private readonly getListUsersByDateAdminService: GetListUsersByDateAdminService,
  ) {}

  @Get('/admin/profit-by-status')
  async getProfitByStatus(): Promise<Proposal[]> {
    const response = this.getListProposalAdminService.execute();

    return response;
  }

  @Get('/admin/best-users')
  async getListUsersByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any[]> {
    const startDateParsed = moment(startDate, 'DD-MM-YYYY', true).toDate();

    const endDateParsed = moment(endDate, 'DD-MM-YYYY').toDate();

    if (startDateParsed > endDateParsed) {
      throw new AppError(
        'Start date must be before or equal to end date.',
        400,
      );
    }

    const response = this.getListUsersByDateAdminService.execute({
      startDate: startDateParsed,
      endDate: endDateParsed,
    });

    return response;
  }
}
