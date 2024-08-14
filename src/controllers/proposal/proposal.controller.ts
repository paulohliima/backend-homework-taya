import { Controller, Get, Param, Post, Req } from '@nestjs/common';

import { Proposal, User } from '../../entities/entities.entity';
import GetProposalService from 'src/services/proposal/getProposal.service';
import ApproveProposalService from 'src/services/proposal/approveProposal.service';
import GetListProposalPendingService from 'src/services/proposal/getListProposalPending.service';
import GetListProposalRefusedService from 'src/services/proposal/getListProposalRefused.service';

@Controller()
export class ProposalController {
  constructor(
    private readonly getProposalService: GetProposalService,
    private readonly getListProposalPendingService: GetListProposalPendingService,
    private readonly getListProposalRefusedService: GetListProposalRefusedService,
    private readonly approveProposalService: ApproveProposalService,
  ) {}

  @Get('/proposals')
  async getPendingProposals(@Req() req: { user: User }): Promise<Proposal[]> {
    const user = req.user;

    const response = this.getListProposalPendingService.execute({
      user,
    });

    return response;
  }

  @Get('/proposals/refused')
  async getRefusedProposals(@Req() req: { user: User }): Promise<Proposal[]> {
    const user = req.user;

    const response = this.getListProposalRefusedService.execute({
      user,
    });

    return response;
  }

  @Get('/proposals/:id')
  async getProposalById(
    @Param('id') proposalId: number,
    @Req() req: { user: User },
  ): Promise<Proposal> {
    const user = req.user;

    const response = this.getProposalService.execute({
      user,
      proposalId,
    });

    return response;
  }

  @Post('/proposals/:proposal_id/approve')
  async approveProposalByUser(
    @Param('proposal_id') proposalId: number,
    @Req() req: { user: User },
  ): Promise<Proposal> {
    const user = req.user;

    const response = this.approveProposalService.execute({
      user,
      proposalId,
    });

    return response;
  }
}
