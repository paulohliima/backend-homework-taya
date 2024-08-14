import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AppError } from 'src/hooks/checkError';
import { Proposal, User } from 'src/entities/entities.entity';

interface IRequest {
  proposalId: number;
  user: User;
}

export default class GetProposalService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
  ) {}

  public async execute({ proposalId, user }: IRequest): Promise<Proposal> {
    const proposal = await this.proposalRepository.findOne({
      where: { id: proposalId, userCreator: Equal(user.id) },
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
