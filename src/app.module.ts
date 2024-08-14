import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AdminController } from './controllers/admin/admin.controller';
import { ProposalController } from './controllers/proposal/proposal.controller';

import { dataSourceOptions } from './configs/ormconfig';
import { Proposal, User } from './entities/entities.entity';

import { UserMiddleware } from './middlewares/get-user-middleware';

import GetProposalService from './services/proposal/getProposal.service';
import GetListProposalPendingService from './services/proposal/getListProposalPending.service';
import GetListProposalRefusedService from './services/proposal/getListProposalRefused.service';
import ApproveProposalService from './services/proposal/approveProposal.service';
import GetListProposalAdminService from './services/admin/getListProposalAdmin.service';
import GetListUsersByDateAdminService from './services/admin/getListUsersByDateAdmin.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User, Proposal]),
  ],
  controllers: [ProposalController, AdminController],
  providers: [
    GetProposalService,
    GetListProposalPendingService,
    GetListProposalRefusedService,
    ApproveProposalService,
    GetListProposalAdminService,
    GetListUsersByDateAdminService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*'); // Apply it for all routes or specify routes
  }
}
