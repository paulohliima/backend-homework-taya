import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../entities/entities.entity';

interface IRequest {
  startDate: Date;
  endDate: Date;
}

interface IResponse {
  id: number;
  fullName: string;
  totalProposal: number;
}

@Injectable()
export default class GetListUsersByDateAdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute({ startDate, endDate }: IRequest): Promise<IResponse[]> {
    const users = await this.userRepository.find({ relations: ['proposals'] });

    const userProfits = users.map((user) => {
      const totalProposal = user.proposals
        .filter(
          (proposal) =>
            proposal.createdAt >= startDate &&
            proposal.createdAt <= endDate &&
            proposal.status === 'SUCCESSFUL',
        )
        .reduce((sum, proposal) => sum + proposal.profit, 0);

      return {
        id: user.id,
        fullName: user.name,
        totalProposal,
      };
    });

    const sortedUserProfits = userProfits.sort(
      (a, b) => b.totalProposal - a.totalProposal,
    );

    return sortedUserProfits;
  }
}
