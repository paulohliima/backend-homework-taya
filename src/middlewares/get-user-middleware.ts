import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

import { AppError } from 'src/hooks/checkError';
import { User } from '../entities/entities.entity';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['user_id'];
    if (userId) {
      const user = await this.userRepository.findOneBy({ id: Number(userId) });
      if (user) {
        (req as any).user = user;
      } else {
        throw new AppError('Permission denied', 403);
      }
    } else {
      throw new AppError('Permission denied', 403);
    }
    next();
  }
}
