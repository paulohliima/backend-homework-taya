import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Proposal } from '../../entities/entities.entity';

@Injectable()
export default class GetListProposalAdminService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,
  ) {}

  async execute(): Promise<any> {
    const result = await this.proposalRepository
      .createQueryBuilder('proposal')
      .select('proposal.status', 'status')
      .addSelect('proposal.userCreatorId', 'userId')
      .addSelect('SUM(proposal.profit)', 'totalProfit')
      .groupBy('proposal.status')
      .addGroupBy('proposal.userCreatorId')
      .getRawMany();

    return result;
  }
}
