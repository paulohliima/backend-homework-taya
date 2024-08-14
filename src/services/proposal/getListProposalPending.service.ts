import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AppError } from 'src/hooks/checkError';
import { ProposalStatus } from 'src/interfaces';
import { Proposal, User } from 'src/entities/entities.entity';

interface IRequest {
  user: User;
}

export default class GetListProposalPendingService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
  ) {}

  public async execute({ user }: IRequest): Promise<Proposal[]> {
    const proposal = await this.proposalRepository.find({
      where: {
        userCreator: Equal(user.id),
        status: ProposalStatus.PENDING,
      },
    });

    if (!proposal) {
      throw new AppError(
        'Proposal not found or you do not have access to it',
        404,
      );
    }

    return proposal;
  }
}
