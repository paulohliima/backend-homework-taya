import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AppError } from 'src/hooks/checkError';
import { ProposalStatus } from 'src/interfaces';
import { Proposal, User } from 'src/entities/entities.entity';

interface IRequest {
  proposalId: number;
  user: User;
}

export default class ApproveProposalService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute({ proposalId, user }: IRequest): Promise<Proposal> {
    const proposal = await this.proposalRepository.findOne({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw new AppError(
        'Proposal not found or you do not have access to it',
        404,
      );
    }

    if (proposal.status !== ProposalStatus.PENDING) {
      throw new AppError('The proposal is not suitable for approval', 403);
    }

    const getUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!getUser) {
      throw new AppError('User not found', 404);
    }

    getUser.balance += proposal.profit;
    proposal.status = ProposalStatus.SUCCESSFUL;

    await this.proposalRepository.save(proposal);

    await this.userRepository.save(getUser);

    return proposal;
  }
}
